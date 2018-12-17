﻿
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using TLKJ.DB;
using TLKJ.Utils;
using Renci.SshNet;
using TLKJAI;
using System.Threading;

namespace TLKJ_IVS
{
    public class CutTask
    {
        static Boolean isAbort = false;
        public static void Execute()
        {
            int iMinVal = StringEx.getInt(INIConfig.ReadString("Config", AppConfig.IMAGE_MIN, "0"));
            int iMaxVal = StringEx.getInt(INIConfig.ReadString("Config", AppConfig.IMAGE_MAX, "0"));

            int iGrayMinVal = StringEx.getInt(INIConfig.ReadString("Config", AppConfig.GRAY_MIN, "0"));
            int iGrayMaxVal = StringEx.getInt(INIConfig.ReadString("Config", AppConfig.GRAY_MAX, "0"));
            int iEXPORT_IMAGE = StringEx.getInt(INIConfig.ReadString("Config", AppConfig.EXPORT_IMAGE, "0"));

            String cUPLOAD_PATH = INIConfig.ReadString("ANALYSE", "DFS_PATH", "");
            String cDFS_TYPE = INIConfig.ReadString("ANALYSE", "DFS_TYPE", "");

            String cAppDir = Application.StartupPath;
            Boolean isUpload = false;
            JActiveTable aMaster = new JActiveTable();
            JActiveTable aSlave = new JActiveTable();
            aSlave.TableName = "XT_IMG_LIST";
            aMaster.TableName = "XT_IMG_REC";
            while (!isAbort)
            {
                log4net.WriteLogFile("分析线程正在运行中......");
                String cFileName = getFileName();
                if (!String.IsNullOrWhiteSpace(cFileName))
                {

                    String cFileExt = Path.GetExtension(cFileName);
                    String cREC_ID = Path.GetFileName(cFileName).Replace(cFileExt, "");

                    Boolean UploadFlag = false;

                    List<KeyValue> ImageList = IMGAI.getImageList(cFileName, iMinVal, iMaxVal, iGrayMinVal, iGrayMaxVal);
                    List<String> sqls = new List<string>();
                    for (int k = 0; (ImageList != null) && (k < ImageList.Count); k++)
                    {
                        Application.DoEvents();
                        KeyValue rowKey = ImageList[k];
                        String cImageFileName = rowKey.Text;
                        if (cDFS_TYPE.Equals("SSH"))
                        {
                            UploadFlag = CopyUtil.Upload(cImageFileName, cUPLOAD_PATH);
                        }
                        else if (cDFS_TYPE.Equals("COPY"))
                        {
                            UploadFlag = CopyUtil.CopyFile(cImageFileName, cUPLOAD_PATH);
                        }
                        else if (cDFS_TYPE.Equals("POST"))
                        {
                            String cUrl = "http://" + cUPLOAD_PATH + "/api/dfs.ashx";
                            UploadFlag = CopyUtil.PostFile(cImageFileName, cUrl);
                        }

                        if (UploadFlag)
                        {
                            isUpload = true;
                            aSlave.ClearField();
                            aSlave.AddField("AI_FLAG", 1);
                            String cKeyID = StringEx.getString(k + 1000);
                            aSlave.AddField("ID", AutoID.getAutoID() + "_" + cKeyID);
                            aSlave.AddField("REC_ID", cREC_ID);
                            aSlave.AddField("FILE_URL", cUPLOAD_PATH + cImageFileName);
                            aSlave.AddField("CREATE_TIME", DateUtils.getDayTimeNum());
                            aSlave.AddField("POINT_LIST", rowKey.Val);
                            sqls.Add(aSlave.getInsertSQL());
                        }
                    }
                    int iCode = DbManager.ExecSQL(sqls);
                    if (iCode > 0)
                    {
                        isUpload = true;
                    }

                    if (isUpload)
                    {
                        aMaster.ClearField();
                        aSlave.AddField("AI_FLAG", 1);
                        iCode = DbManager.ExecSQL(aMaster.getUpdateSQL(" REC_ID='" + cREC_ID + "' "));
                        if (iCode > 0)
                        {
                            log4net.WriteLogFile("REC_ID为：" + cREC_ID + "的图片抠图成功！");
                        }
                    }
                }
                try
                {
                    Thread.Sleep(100);
                }
                catch (Exception ex)
                {

                }
            }
        }
        public static Queue<String> ImageList = null;
        public static String getFileName()
        {
            if (ImageList == null)
            {
                ImageList = new Queue<string>();
            }

            if (ImageList.Count == 0)
            {
                String cDFS_PATH = INIConfig.ReadString("ANALYSE", "FILE_PATH");
                String[] FileList = Directory.GetFiles(cDFS_PATH);
                for (int i = 0; i < FileList.Length; i++)
                {
                    String cFileName = FileList[i];
                    ImageList.Enqueue(cFileName);
                    if (i > 10)
                    {
                        break;
                    }
                }
            }
            if (ImageList.Count > 0)
            {
                String cFileName = ImageList.Dequeue();
                return cFileName;
            }
            else
            {
                return null;
            }
        }
    }
}
