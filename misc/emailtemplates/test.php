<?php 
$customerId = $_REQUEST['cid'];
$friends = $_REQUEST['frnds'];
$followers = $_REQUEST['flwrs'];
$who = $_REQUEST['who'];
$what = $_REQUEST['what'];
$why = $_REQUEST['why'];
$how = $_REQUEST['how'];
$headline = $_REQUEST['hline'];
$date = $_REQUEST['date'];
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Templates 3</title>
<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700' rel='stylesheet' type='text/css'>
<style>
body {
	margin: 0;
	padding: 0
}
.clear {
	clear: both
}
.hRuler {
	background: url(imgs/hRuler-bg.png) repeat-x;
	height: 16px;
	border: none;
	margin: 0
}
.wrapper {
	width: 640px;
	margin: 0 auto;
	background: url(imgs/body-bg.png) repeat;
	padding: 15px 15px 30px 15px
}
.emailTemp {
	width: 570px;
	padding: 20px;
	background-color: #fff;
	font-family: "Open Sans Condensed";
	font-weight: 300;
	margin: 0 auto
}
.header {
	height: 80px
}
.headerLogo {
	float: left;
}
.appStore {
	float: right
}
.contentHeader {
	padding: 15px 0
}
.contentHeader h1 {
	font-size: 36px;
	color: #0b68a8;
	margin-top: -10px;
	float: left
}
.contentHeader img {
	float: left;
	margin-right: 15px
}
.contentHeader p.date {
	float: right;
	margin: 0;
	margin-top: -15px
}
.contentHeader ul {
	list-style: none;
	float: left;
	width: 300px;
	margin-top: -20px;
	margin-left: 36px
}
.contentHeader ul li {
	float: left;
	margin-right: 10px;
	border-right: 1px solid #13345c;
	padding-right: 10px
}
.contentHeader ul li.last {
	border: none
}
.contentHeader ul li a {
	color: #13345c;
	text-decoration: none
}
.contentBody {
}
.contentBody h1 {
	background-color: #0066cc;
	text-align: center;
	margin: 0;
	color: #fff;
	font-size: 21px;
	font-weight: bold;
	padding: 5px 0
}
.contentBody img {
	float: right;
	margin: 20px 0 0 25px
}
.contentBody p.date {
	float: right;
	margin: 0;
	margin-top: -40px
}
.textLeft {
	width: 40%;
	float: left;
	padding: 0 5%
}
.textRight {
	width: 50%;
	float: right
}
.textRight p {
	font: 21px;
	font-weight: normal
}
.textRight p.free {
	color: #f04927;
	text-align: center;
	text-transform: uppercase;
	font-weight: bold;
	font-size: 24px
}
.btnDownload {
	background: url(imgs/emailTemp1/download-bg.png) repeat-x;
	height: 24px;
	width: 207px;
	text-align: center;
	padding: 8px 0;
	display: block;
	text-decoration: none;
	font-size: 21px;
	color: #fff;
	border: 1px solid #c64435;
	-webkit-border-radius: 5px;
	-moz-border-radius: 5px;
	border-radius: 5px;
	margin: 0 auto
}
.contentFooter {
}
.contentFooter p {
	font-size: 18px;
	font-weight: normal;
	color: #333
}
.contentFooter p span {
	font-weight: bold
}
.footer {
}
.footer ul {
	list-style: none;
	margin-left: -65px;
}
.footer ul li {
	height: 30px;
	float: left;
	margin-right: 20px;
	margin-left: 30px;
}
.footer ul li.tweet {
	background: url(imgs/twitter.png) no-repeat;
	width: 24px;
	height: 17px;
	padding-left: 35px
}
.footer ul li.like {
	background: url(imgs/like.png) no-repeat;
	width: 17px;
	height: 20px;
	padding-left: 25px
}
.footer ul li.count {
	background: url(imgs/likeCount.png) no-repeat;
	width: 59px;
	height: 38px;
	padding-top: 10px;
	text-align: center;
	margin-top: -10px;
	padding-left: 4px
}
.footer ul li a {
	text-decoration: none;
	color: #333
}
</style>
</head>

<body>
<div class="wrapper">
<div class="emailTemp">
  <div class="header">
    <div class="headerLogo"> <img src="imgs/logo.png" width="161" height="62" alt="tiny news" title="Tiny News" /> </div>
    <!--/headerLogo-->
    <div class="appStore"> <img src="imgs/appStore.png" width="152" height="55" alt="apple store" title="Apple Store" /> </div>
    <!--/appStore-->
    <div class="clear"></div>
    <!-- clear--> 
  </div>
  <!--/headr-->
  <hr class="hRuler" />
  <div class="contentHeader"> <img src="http://23.23.145.71/salebynow/form.htm?action=loadThumbImage&image=customer&picid=<?php echo($customerId)?>" width="62" height="61" alt="user logo" title="" />
    <h1><?php echo($headline)?></h1>
    <ul>
      <li><a href="#"><?php echo($friends)?> stories</a></li>
      <li><a href="#"><?php echo($followes)?> followers</a></li>
      <li class="last"><a href="#"><?php echo($friends) ?> friends</a></li>
    </ul>
  </div>
  <!--/contentheader-->
  <div class="clear"></div>
  <!--/clear-->
  
  <div class="contentBody">
    <h1><?php echo($headline) ?></h1>
    <img src="imgs/emailTemp3/img1.jpg" width="262" height="189" alt="" title="" />
    <p>WHO: <?php echo($who)?>.</p>
    <p>WHAT: <?php echo($what)?>.</p>
    <p>HOW: <?php echo($how)?>.</p>
    <p>WHY: <?php echo($why)?>.</p>
    <p class="date"><?php echo($date)?> </p>
    <img src="imgs/emailTemp3/img2.jpg" width="567" height="303" alt="" title="" style="margin-bottom:15px" />
    <div class="clear"></div>
    <!--/clear-->
    <h1>About tiny news</h1>
    <div class="contentFooter">
      <div class="textLeft">
        <p>Tiny News put together a team from around the world to help you create, share, and find news that matters to you -- right now, and in the long term.  Tiny News is <span>immediate, interactive, social, global and local, location based,</span> and <span>exciting.</span></p>
      </div>
      <!--/left-->
      <div class="textRight">
        <p style="margin-bottom:50px"><span>The Ultimate Social News Taco... with Tobasco</span> (Yes, we rock)</p>
        <a href="#" class="btnDownload">Download Now</a>
        <p class="free">its free!</p>
      </div>
      <!--/right-->
      <div class="clear"></div>
    </div>
    <!--/contentFooter
    	
    </div><!--/contentBody-->
    <div class="clear"></div>
    <!--/clear-->
    
    <div class="footer">
      <hr class="hRuler" />
      <ul>
        <li class="tweet"><a href="#">Tweet</a></li>
        <li class="like"><a href="#">Like</a></li>
        <li class="count"><a href="#">123</a></li>
      </ul>
      <div class="clear"></div>
      <!--/clear--> 
    </div>
    <!--/footer--> 
  </div>
  <!--/emailTemp--> 
</div>
<!--/wrapper-->
</body>
</html>

