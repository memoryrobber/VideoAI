var vLOGIN_USER_ID;
var vLOGIN_ORG_ID;

var vLOGIN_XZQDM_LIST;
var vLOGIN_XZQMC_LIST;

var vLOGIN_USER_INF = new Object();

var vACTIVE_CITY_ID;
var vACTIVE_COUNTY_ID;

function getOrgType() {
    return vLOGIN_ORG_ID.length;
}

function getListKeyValue(vStr, vIdx) {
    var vKeyList = vStr.split("_");
    return vKeyList[vIdx];
}

function getActiveOrgID() {
    var cVal = $("#GXQ_COUNTY_ID").val();
    if (typeof (cVal) != "undefined") {
        return cVal;
    }
    else {
        return null;
    }
}
function Parent_Reload() {
    self.parent.location.reload();
}
function getDayTimeValue(vDayTimeNum, vFmt) {
    var cYear = vDayTimeNum.substr(0, 4);
    var cMonth = vDayTimeNum.substr(4, 2);
    var cDay = vDayTimeNum.substr(6, 2);
    var cHour = vDayTimeNum.substr(8, 2);
    var cMinute = vDayTimeNum.substr(10, 2);
    var cSecond = vDayTimeNum.substr(12, 2);
    return cYear + "-" + cMonth + "-" + cDay + " " + cHour + ":" + cMinute + ":" + cSecond;
}

function getDayTime(vDayTimeNum) {
    return getDayTimeValue(vDayTimeNum, null);
}

function InitLoadTB() {
    var vJCTB_GUID = $("#JCTB_GUID");
    var vJCTB_INFO = $("#JCTB_INFO");
    if ((vJCTB_GUID) && (vJCTB_GUID)) {
        vJCTB_INFO.load("/framework/tbbaseinfo.aspx?JCTB_GUID=" + vJCTB_GUID.val());
    }
}
function getAjaxUrl() {
    var vHost = getCookie("SERVER_HOST");
    var vPort = getCookie("SERVER_PORT");
    var vHeader = "";
    if ((vHost != null) && (vPort != null)) {
        vHeader = "http://" + vHost + ":" + vPort;
    }
    return vHeader;
}

function getCookie(cKeyName) {
    var vKeyList;
    var vRegExpr = new RegExp("(^| )" + cKeyName + "=([^;]*)(;|$)");
    if (vKeyList = document.cookie.match(vRegExpr))
        return unescape(vKeyList[2]);
    else
        return null;
}

function getAreaID() {
    var vORGID = getCookie("ORG_ID");
    return vORGID.replace("00", "");
}

function getOrg_ID() {
    var vORGID = getCookie("ORG_ID");
    return "411025";
}

function getOrgType() {
    var vORGID = getAreaID();
    return vORGID.length;

}

function InitSelect() {
    $("select").each(function () {
        var cVal = $(this).attr("data-val");
        if (typeof (value) != "undefined") {
            if (cVal.length > 0) {
                $(this).val(cVal);
            }
        }
    });
}

Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        alert(week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function InitEvent() {
    $("#GXQ_CITY_ID").change(function () {
        var vRSLength = $("#GXQ_COUNTY_ID option").length;
        if (vRSLength == 0) {
            Event_GXQ_CITYChange($(this));
        }
    });
    $("#XZQ_CITY_ID").change(function () {
        var vRSLength = $("#XZQ_COUNTY_ID option").length;
        if (vRSLength == 0) {
            Event_XZQ_CITYChange($(this));
        }
    });

    $("[data-tag='page']").click(function () {
        Event_PageChange($(this));
    });

    $("[data-tag='add']").click(function () {
        Event_AddNew($(this));
    });

    $("[data-tag='edit']").click(function () {
        Event_Modify($(this));
    });

    $("[data-tag='del_item']").click(function () {
        Event_DEL_Item($(this));
    });

    $("[data-tag='submit']").click(function () {
        Event_AjaxSubmit();
    });

    $("[data-tag='del_list']").click(function () {
        Event_DEL_List($(this));
    });

    $("[data-tag='close']").click(function () {
        AjaxClose();
    });

    $("[data-tag='nav']").click(function () {
        Event_NavChange($(this));
    });
}

$(document).ready(function () {
    InitEvent();
    InitSelect();
    InitLoadTB();
});

function setLeftView(vFlag) {
    if (vFlag)
        $(".selfui-side-left-top").show();
    else
        $(".selfui-side-left-top").hide();
}

function Event_AjaxSubmit() {
    var vUrl = getAjaxUrl() + "/api/rest.ashx";
    var vActionType = $("#action_type").val();
    var vActionMethod = $("#action_method").val();
    vUrl = vUrl + "?action_type=" + vActionType + "&action_method=" + vActionMethod;
    var cValue = $("#form1").formSerialize();
    alert(cValue);
    $.ajax({
        type: "POST",
        url: vUrl,
        dataType: "json",
        cache: false,
        data: cValue + "&no-cache=" + Math.round(Math.random() * 10000),
        success: Event_AfterSubmit
    });
}

function Event_AfterSubmit(ret) {
    // 保存成功 
    if (ret.result == 1) {
        alert("数据保存成功！");
        window.parent.location.reload();
        return;
    }

    // 保存失败
    if (ret.result == 2) {
        alert("数据保存失败！");
        return;
    }

    // 验证失败
    if (ret.result == 3) {
        var vCtrlID = ret.ctrlID;
        var vMessage = ret.message;
        $("#" + vCtrlID).focus();
        alert(vMessage);
        return;
    }
}
function Event_DEL_Item(vObj) {
    var vUrl = getAjaxUrl() + "/api/rest.ashx";
    var vActionType = $("#action_type").val();
    var vActionMethod = "del_item";
    vUrl = vUrl + "?action_type=" + vActionType + "&action_method=" + vActionMethod;

    var cValue = "dbkey=" + $(vObj).attr("data-val");
    $.ajax({
        type: "POST",
        url: vUrl,
        dataType: "json",
        cache: false,
        data: cValue + "&no-cache=" + Math.round(Math.random() * 10000),
        success: Event_AfterDel_Item
    });
}

function Event_AfterDel_Item(ret) {
    // 保存成功
    if (ret.result == 1) {
        alert("数据删除成功！");
        self.location.reload();
    } else {
        ValidMessage(ret);
    }
}
function Event_AddNew(vObj) {
    var vUrl = $(vObj).attr("data-href");
    if (vUrl == null) {
        vUrl = getUrl();
    }
    vUrl = vUrl.replace("list", "edit");
    var vTitle = $(vObj).attr("data-title");
    AjaxOpenLayer(vTitle, vUrl, "800px", "640px");
}

function Event_Modify(vObj) {
    var vUrl = $(vObj).attr("data-href");
    if (vUrl == null) {
        vUrl = getUrl();
    }

    vUrl = vUrl.replace("list", "edit");
    vUrl = vUrl.replace("#", "");
    var vTitle = $(vObj).attr("data-title");
    var vKeyVal = $(vObj).attr("data-val");
    vUrl = vUrl + "?dbkey=" + vKeyVal;
    AjaxOpenLayer(vTitle, vUrl, "800px", "640px");
}

function Event_DEL_List(vObj) {
    var vUrl = getUrl();
    vUrl = getAjaxUrl() + "/api/rest.ashx";
    var vActionType = $("#action_type").val();
    var vActionMethod = "del_list";
    vUrl = vUrl + "?action_type=" + vActionType + "&action_method=" + vActionMethod;

    $('input:checkbox[data-group=checkboxes]:checked').each(function (i) {
        vKeyList.push($(this).val());
    });

    var cValue = "dbkeys=" + vKeyList.join(",");
    $.ajax({
        type: "POST",
        url: vUrl,
        dataType: "json",
        cache: false,
        data: cValue + "&no-cache=" + Math.round(Math.random() * 10000),
        success: Event_AfterDel_List
    });
}

/* 添加完成后回调 */
function Event_AfterDel_List(ret) {
    // 保存成功
    if (ret.result == 1) {
        alert("数据删除成功！");
        self.location.reload();
        return 1;
    } else {
        ValidMessage(ret);
    }
}
function getUrl() {
    var vUrlString = window.location.href;
    var vIdx = vUrlString.indexOf("?");
    var vUrl = null;
    if (vIdx > -1) {
        vUrl = vUrlString.substring(0, vIdx);
    } else {
        vUrl = vUrlString;
    }
    return vUrl;
}

function Event_PageChange(vObj) {
    var vUrlString = location.href;
    var vUrl = "";
    var vQueryString = "";
    var vIdx = vUrlString.indexOf("?");
    if (vIdx > -1) {
        vUrl = vUrlString.substring(0, vIdx);
        vQueryString = vUrlString.substring(vIdx + 1, vUrlString.length);
    } else {
        vUrl = vUrlString;
        vQueryString = "";
    }

    var vPage = $(vObj).attr("data-val");
    var vPageSize = $("#__PAGE_SIZE").val();
    if (vPage == "Prev") {
        var vPageNo = $("#__PAGE_NO").val();
        vPage = vPageNo - 1;
        vQueryString = AddOrReplace(vQueryString, "__PAGE_NO", vPage);
    } else if (vPage == "Next") {
        var vPageNo = $("#__PAGE_NO").val();
        vPage = vPageNo + 1;
        vQueryString = AddOrReplace(vQueryString, "__PAGE_NO", vPage);
    } else {
        vQueryString = AddOrReplace(vQueryString, "__PAGE_NO", vPage);
    }
    vQueryString = AddOrReplace(vQueryString, "__PAGE_SIZE", vPageSize);
    location.href = vUrl + "?" + vQueryString;
}

function Event_NavChange(vObj) {
    var cVal = $(vObj).attr("data-val");
    var cHref = $(vObj).attr("data-href");
    afterTipClick(cVal);
    var cTitle = $(vObj).attr("data-dialog");
    $("#TAG").val(cVal);
    if ((typeof (cTitle) != "undefined") && (typeof (cHref) != "undefined")) {
        var cWidth = $(vObj).attr("data-width");
        var cHeight = $(vObj).attr("data-height");
        if (typeof (cWidth) == "undefined") {
            cWidth = "800px";
        }
        if (typeof (cHeight) == "undefined") {
            cHeight = "600px";
        }

        AjaxOpenDialog(cTitle, cHref, cWidth, cHeight);
    }
    else if (typeof (cHref) != "undefined") {
        $("#layui-main").load(cHref);
    }
    else {
        $("#layui-main").load("../../framework/Nav_" + cVal + ".aspx");
    }
}

function AddOrReplace(vUrl, cKeyName, cKeyValue) {
    var ParmList = vUrl.split("&");
    var vFind = false;
    for (var i = 0; i < ParmList.length; i++) {
        var c = ParmList[i].split("=");
        if (c[0] == cKeyName) {
            c[1] = cKeyValue;
            ParmList[i] = c.join("=");
            vFind = true;
            break;
        }
    }
    if (!vFind) {
        var vParm = [];
        vParm[0] = cKeyName;
        vParm[1] = cKeyValue;
        ParmList[i] = vParm.join("=");
    }
    return ParmList.join("&");
}

function getQueryString(cKeyName) {
    var reg = new RegExp("(^|&)" + cKeyName + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function OpenAjaxLayer(vTitle, vUrl, iWidth, iHeight, vAllowClose) {
    layer.open({
        type: 2,
        title: vTitle,
        maxmin: vAllowClose, // 开启最大化最小化按钮
        shadeClose: vAllowClose,
        shade: 0.2,
        content: [vUrl, 'yes'], // iframe的url，no代表不显示滚动条
        area: [iWidth, iHeight],
        offset: ['30px', '']
    });
}

/* 弹出层，允许最大化 */
function AjaxOpenLayer(vTitle, vUrl, iWidth, iHeight) {
    var vLength = arguments.length;
    if (vLength < 3) {
        iWidth = "640px";
        iHeight = "480px";
    }
    return OpenAjaxLayer(vTitle, vUrl, iWidth, iHeight, true);
}

/* 弹出层，不允许最大化 */
function AjaxOpenDialog(vTitle, vUrl, iWidth, iHeight) {
    var vLength = arguments.length;
    if (vLength < 3) {
        iWidth = "640px";
        iHeight = "480px";
    }
    return OpenAjaxLayer(vTitle, vUrl, iWidth, iHeight, false);
}

function Array_DeleteIndex(vArray, vIndex) {
    var vKeyList = [];
    for (var i = 0; i < vArray.length; i++) {
        if (vIndex == i) {
            continue;
        }
        vKeyList.push(vArray[i]);
    }
    return vArray;
}

function Array_FindIndex(vArray, vKeyID) {
    var vObj = null;
    for (var i = 0; i < vArray.length; i++) {
        if (vKeyID == vArray[i]) {
            vObj = vArray[i];
            break;
        }
    }
    return vObj;
}

function Delete_Control(vKeyID) {
    $("#" + vKeyID).remove();
}

/* 关闭弹出层 */

function AjaxClose() {
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
}

function Event_GXQ_CITYChange(vObj) {
    var vUrl = getAjaxUrl() + "/api/rest.ashx";
    var vActionType = "GXQInf";
    var vActionMethod = "list";
    vACTIVE_CITY_ID = $("#GXQ_CITY_ID").val();
    vUrl = vUrl + "?action_type=" + vActionType + "&action_method=" + vActionMethod;
    var cValue = "GXQ_CITY_ID=" + vACTIVE_CITY_ID;
    $.ajax({
        type: "POST",
        url: vUrl,
        dataType: "json",
        cache: false,
        data: cValue + "&no-cache=" + Math.round(Math.random() * 10000),
        success: Event_AfterGXQCityChange
    });
}

function Event_AfterGXQCityChange(vObj) {
    $("#GXQ_COUNTY_ID").empty();
    var rs = vObj.rows;
    for (var i = 0; i < rs.length; i++) {
        var vo = rs[i];
        $("#GXQ_COUNTY_ID").append("<option value=" + vo.gxq_id + ">" + vo.gxq_id + "-" + vo.gxq_name + "</option>");
    }
}

function Event_XZQ_CITYChange(vObj) {
    var vUrl = getAjaxUrl() + "/api/rest.ashx";
    var vActionType = "XZQInf";
    var vActionMethod = "list";
    vACTIVE_CITY_ID = $("#XZQ_CITY_ID").val();
    vUrl = vUrl + "?action_type=" + vActionType + "&action_method=" + vActionMethod;
    var cValue = "XZQ_CITY_ID=" + vACTIVE_CITY_ID;
    $.ajax({
        type: "POST",
        url: vUrl,
        dataType: "json",
        cache: false,
        data: cValue + "&no-cache=" + Math.round(Math.random() * 10000),
        success: Event_AfterXZQCityChange
    });
}

function Event_AfterXZQCityChange(vObj) {
    $("#XZQ_COUNTY_ID").empty();
    var rs = vObj.rows;
    for (var i = 0; i < rs.length; i++) {
        var vo = rs[i];
        $("#XZQ_COUNTY_ID").append("<option value=" + vo.xzq_id + ">" + vo.xzq_id + "-" + vo.xzq_name + "</option>");
    }
}

function setPageReadOnly() {
    $('input[type="text"]').attr("disabled", true);
    $('input[type="checkbox"]').attr("disabled", true);
    $('input[type="radio"]').attr("disabled", true);
    $('select').attr("disabled", true);
}

function getGUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function afterTipClick(index) {
    if (index == '3' || index == '6' || index == '99') {
        $("#left-tbinfo").hide();
        $(".selfui-side-left-top").hide();
        $(".rightTemp").hide();
        $(".innerTemp").remove();
        $(".layui-side-right").append("<div class='innerTemp'></div>");
    } else {
        $("#left-tbinfo").show();
        $(".selfui-side-left-top").show();
        $(".rightTemp").show();
        $(".innerTemp").hide();
    }
    if (index != "6") {
        $(".innerTemp-button").remove();

    } else {
        $(".selfui-side-left-top").show();
    }
}

function OpenWinForm(vUrl) {
    OpenIEUrl(vUrl);
    OpenFoxUrl(vUrl);
}

function OpenIEUrl(vUrl) {
    try {
        window.external.OpenWinUrl(vUrl);
        return true;
    }
    catch (ex) {
        return false;
    }
}

function OpenFoxUrl(vUrl) {
    try {
        var event = new MessageEvent('OpenWinUrl', { 'view': window, 'bubbles': false, 'cancelable': false, 'data': vUrl });
        document.dispatchEvent(event);
    }
    catch (ex) {
        ;
    }
}
