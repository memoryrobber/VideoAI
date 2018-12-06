﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="export_service.aspx.cs" Inherits="export_service" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="/static/css/bootstrap.min.css" rel="stylesheet" />
    <link href="/static/bootstrap/bootstrap-table.min.css" rel="stylesheet" />
    <script type="text/javascript" src="/static/js/jquery.js"></script>
    <script type="text/javascript" src="/static/bootstrap/bootstrap-table.min.js"></script>
    <script type="text/javascript" src="/static/bootstrap/bootstrap-table-zh-CN.js"></script>
    <script type="text/javascript" src="/static/js/layer/layer.js"></script>
    <script type="text/javascript" src="/static/js/default.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            InitGrid();
        });

        function SelectChange(vObj) {
            if ($(vObj).is(':checked')) {
                $('input[name="CK"]').each(function () {
                    $(this).prop("checked", true);
                });
            } else {
                $('input[name="CK"]').each(function () {
                    $(this).prop("checked", false);
                });
            }
        }
        function InitGrid() {
            $('#DBGrid').bootstrapTable({
                url: '/api/rest.ashx?action_type=WXJB&action_method=export_query',         //请求后台的URL（*）
                method: 'get',                  //请求方式（*）
                striped: true,                  //是否显示行间隔色
                cache: false,                   //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true,               //是否显示分页（*）
                sortable: false,                //是否启用排序
                sortOrder: "asc",               //排序方式
                sidePagination: "server",       //分页方式：client客户端分页，server服务端分页（*）
                queryParams: getParams,         //传递参数（*）
                pageNumber: 1,                  //初始化加载第一页，默认第一页
                pageSize: 15,                   //每页的记录行数（*）
                pageList: [15, 30, 50, 100],    //可供选择的每页的行数（*）
                strictSearch: true,
                clickToSelect: true,            //是否启用点击选中行
                uniqueId: "id",                 //每一行的唯一标识，一般为主键列
                cardView: false,                //是否显示详细视图
                detailView: false,              //是否显示父子表
                columns: [
                    {
                        field: 'id'
                        , title: '<input type=checkbox id="CHANGE_ID" onclick="SelectChange(this);" />'
                        , align: 'center'
                        , formatter: function (value, row, index) {
                            return "<input type='checkbox' value='" + row.id + "' name='CK' />";
                        }
                    },
                    {
                        field: 'id'
                        , title: '序号'
                        , align: 'center'
                        , formatter: function (value, row, index) {
                            return index + 1;
                        }
                    },
                     {
                         field: 'time'
                        , title: '举报时间'
                        , align: 'center'
                     },
                    {
                        field: 'xianqu',
                        align: 'center'
                        , title: '县区'
                    },

                    {
                        field: 'adress'
                        , title: '详细地址'
                        , align: 'center'
                    },
                    {
                        field: 'danwei'
                        , title: '被举报单位或个人'
                        , align: 'center'
                    },
                    {
                        field: 'neirong'
                        , title: '举报内容'
                        , align: 'center'
                    },
                         {
                             field: 'result_date'
                        , title: '处理情况'
                        , align: 'center'
                       , formatter: function (value, row, index) {
                           return value;
                       }
                         }, {
                             field: 'result'
                        , title: '初步审核'
                        , align: 'center'
                       , formatter: function (value, row, index) {
                           return "<span title='" + value + "'>" + value.substring(0, 30); +"</span>";
                       }
                         }

                ]
            });
        }

        function Modify_Event(cKey_ID) {
            AjaxOpenDialog('处理举报', "wx_jb_edit.aspx?ID=" + cKey_ID, "640px", "480px");
        }

        function ExportClick() {
            var cID_LIST = "";
            var cTABLE_ID = $("#TABLE_ID").val();
            $("input[type='checkbox']").each(function () {
                if ($(this).prop('checked')) {
                    if (cID_LIST == "") {
                        cID_LIST = this.value;
                    }
                    else {
                        cID_LIST = cID_LIST + "," + this.value;
                    }
                }
            });

            if (cID_LIST == "") {
                alert("请选择你要导出的数据！");
            }
            else {
                $("#rf").attr("src", "export.ashx?IDS=" + cID_LIST + "&TABLE_ID=" + cTABLE_ID)
            }
        }

        function ImportClick() {

        }

        var getParams = function (params) {
            var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.limit, //页面大小
                offset: params.offset, //页码
                maxrows: params.limit,
                pageindex: params.pageNumber,
                APPID: "<%=getLoginUserInfo().APPID %>"
            };
            return temp;
        };
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title">
                数据服务-数据导出</h3>
        </div>
        <h3 class="panel-title">
            <input type="button" value="导出举报数据" onclick="ExportClick();" />
        </h3>
        <div class="panel-body">
            <table id="DBGrid">
            </table>
        </div>
    </div>
    <input type="hidden" id="TABLE_ID" name="TABLE_ID" value="101" />
    <iframe id="rf" name="rf" style="display: none" frameborder="0px" />
    </form>
</body>
</html>