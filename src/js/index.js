/*var arr=[1,23,44,5];
store.set("aa",arr);
store.clearAll();*/

var task_list=[];
var $add_task=$(".add-task");
init();

//点击提交
$add_task.on("submit",function(ev){
	ev.preventDefault();//阻止提交默认事件，以执行后续
	var obj={};
	obj.content=$add_task.find("input").eq(0).val();

	if(!obj.content)return;//没有输入时

	add_task(obj);
	createHtml();
	$add_task.find("input").eq(0).val(null);//清空输入框
});

//初始化。将之前的数据取出，并以此创建html
function init(){
	task_list=store.get("gg")||[];//刷新后从store获取之前的数据
	createHtml();
}

//将数据存入数组和store
function add_task(obj){
	task_list.push(obj);
	store.set("gg",task_list);//每点击一次存入store
}


//1.创建一个空对象去获取内容到属性里  push对象到空数组里面
//2.把数据存到浏览器
//3.把数据取出来

//生成html
function createHtml(){
	var $task_list=$(".task-list");
	$task_list.html(null); //先清空原来的页面，再根据原来的数据重新创建页面
	for(var i=0;i<task_list.length;i++){
		var $item=bindHtml(task_list[i],i);
		$task_list.prepend($item);
	}
	bindDelete();//点击删除
	task_list_detail();//点击详细
	add_complated();//勾选
}

//绑定html
function  bindHtml(data,index){
	var str='<li data-index="'+index+'">'+
			'<input type="checkbox" class="complete" '+(data.complete ? "checked":"")+'>'+
			'<p class="content">'+data.content+'</p>'+
			'<div class="right">'+
			'<span class="delete r-main">删除</span>'+
			'<span class="detail r-main">详细</span>'+
			'</div>'+
			'</li>'
	return str;
}

/*------------------------删除----------------------------*/
//点击删除按钮
function bindDelete(){
	$(".delete.r-main").click(function(){
		//获取行index
		var index = $(this).parent().parent().data("index");
		remove_task_list(index)
	})
}
//删除数据
function remove_task_list(index){
	var off = confirm("你确定要删除么");
	if(!off)return;
	task_list.splice(index,1);
	refresh_task_list();
}
//更新存储
function refresh_task_list(){
	store.set("gg",task_list);
	createHtml();
}
/*------------------------删除 end-----------------------------*/


/*------------------------详细---------------------------------*/
//1点击获取id
function task_list_detail(){
	$(".detail.r-main").click(function(){
		//获取行index
		var index = $(this).parent().parent().data("index");
		create_detail(task_list[index],index);
	})
}
//2生成弹框
function create_detail(data,index){
	str =  '<div class="task-detail-mask"></div>'+
			'<div class="task-detail">'+
			'<form class="up-task">'+
			'<h2 class="content">'+(data.content||"")+'</h2>'+
			'<div class="input-item">'+
			'<input type="text" class="title-input">'+
			'</div>'+
			'<div class="input-item">'+
			'<textarea class="detailtext">'+(data.detail||"")+'</textarea>'+
			'</div>'+
			'<div class="remind input-item">'+
			'<label for="b">提醒时间</label>'+
			'<input id="b" class="datetime" type="date" value="'+(data.datetime||"")+'">'+
			'</div>'+
			'<div class="input-item">'+
			'<button class="update-detail-btn">更新</button>'+
			'</div>'+
			'<div class="colse">x</div>'+
			'</form>'+
			'</div>'+
			'</div>';
	$(".container").append(str);
	remove_detail();//点击关闭
	task_update(data,index);//点击更新
	doubleTitle();//双击题目修改
}
//3删除弹框 removechild()
function remove_detail(){
	$(".task-detail-mask,.colse").click(function(){
		$(".task-detail-mask,.task-detail").remove();
	})
}
/*------------------------详细 end-----------------------------*/

/*-----------------------详细提交------------------------------*/
//1点击更新 获取index
//2新建一个对象，将输入数据传到对象
//3将对象覆盖到数组的相应位置
function task_update(data,index) {
	$(".up-task").on("submit", function (ev) {
		ev.preventDefault();
		//新建对象
		var udate = {};
		//获取输入
		udate.content = $(this).find(".content").text();
		udate.detail = $(this).find(".detailtext").val();
		udate.datetime = $(this).find(".datetime").val();

		//覆盖
		up_data(udate, index)
		//console.log(udate);
		//console.log(task_list);
		//提交后关闭弹框
		$(".task-detail-mask,.task-detail").remove();
		createHtml();
	})
}
//用弹出框数据覆盖旧数据
function up_data(obj,index){
	//task_list[index]=obj;//会全覆盖
	task_list[index]= $.extend({},task_list[index],obj)//增量覆盖
	//存到本地
	store.set("gg",task_list);
}
/*-----------------------详细提交end------------------------------*/
//双击标题
function doubleTitle(){
	var $oH = $(".up-task .content");
	$oH.on("dblclick",function() {
		var $inputVal = $(".title-input");

		$oH.hide();
		$inputVal.val($oH.text());
		$inputVal.show();

		$inputVal.focus();//自动获取焦点

		$inputVal.on("blur",function () {//失去焦点时
			$oH.show();
			$inputVal.hide();
			if(!$inputVal.val()) return;//修改为空时不修改
			$oH.text($inputVal.val())
		})
	})
}

//点击复选框添加complated
function add_complated(){
	var complete = $(".task-list .complete");
	complete.click(function(){
		var index = $(this).parent().data("index");
		if(task_list[index].complete){
			up_data({complete:false},index)
		}
		else{
			up_data({complete:true},index)
		}
	});
}