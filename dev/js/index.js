function init(){task_list=store.get("gg")||[],createHtml()}function add_task(t){task_list.push(t),store.set("gg",task_list)}function createHtml(){var t=$(".task-list");t.html(null);for(var e=0;e<task_list.length;e++){var a=bindHtml(task_list[e],e);t.prepend(a)}bindDelete(),task_list_detail(),add_complated()}function bindHtml(t,e){return'<li data-index="'+e+'"><input type="checkbox" class="complete" '+(t.complete?"checked":"")+'><p class="content">'+t.content+'</p><div class="right"><span class="delete r-main">删除</span><span class="detail r-main">详细</span></div></li>'}function bindDelete(){$(".delete.r-main").click(function(){remove_task_list($(this).parent().parent().data("index"))})}function remove_task_list(t){confirm("你确定要删除么")&&(task_list.splice(t,1),refresh_task_list())}function refresh_task_list(){store.set("gg",task_list),createHtml()}function task_list_detail(){$(".detail.r-main").click(function(){var t=$(this).parent().parent().data("index");create_detail(task_list[t],t)})}function create_detail(t,e){str='<div class="task-detail-mask"></div><div class="task-detail"><form class="up-task"><h2 class="content">'+(t.content||"")+'</h2><div class="input-item"><input type="text" class="title-input"></div><div class="input-item"><textarea class="detailtext">'+(t.detail||"")+'</textarea></div><div class="remind input-item"><label for="b">提醒时间</label><input id="b" class="datetime" type="date" value="'+(t.datetime||"")+'"></div><div class="input-item"><button class="update-detail-btn">更新</button></div><div class="colse">x</div></form></div></div>',$(".container").append(str),remove_detail(),task_update(t,e),doubleTitle()}function remove_detail(){$(".task-detail-mask,.colse").click(function(){$(".task-detail-mask,.task-detail").remove()})}function task_update(t,e){$(".up-task").on("submit",function(t){t.preventDefault();var a={};a.content=$(this).find(".content").text(),a.detail=$(this).find(".detailtext").val(),a.datetime=$(this).find(".datetime").val(),up_data(a,e),$(".task-detail-mask,.task-detail").remove(),createHtml()})}function up_data(t,e){task_list[e]=$.extend({},task_list[e],t),store.set("gg",task_list)}function doubleTitle(){var t=$(".up-task .content");t.on("dblclick",function(){var e=$(".title-input");t.hide(),e.val(t.text()),e.show(),e.focus(),e.on("blur",function(){t.show(),e.hide(),e.val()&&t.text(e.val())})})}function add_complated(){$(".task-list .complete").click(function(){var t=$(this).parent().data("index");task_list[t].complete?up_data({complete:!1},t):up_data({complete:!0},t)})}var task_list=[],$add_task=$(".add-task");init(),$add_task.on("submit",function(t){t.preventDefault();var e={};e.content=$add_task.find("input").eq(0).val(),e.content&&(add_task(e),createHtml(),$add_task.find("input").eq(0).val(null))}),console.log(2);