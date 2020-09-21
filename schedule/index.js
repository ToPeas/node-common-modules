const schedule = require('node-schedule');

// 每天定时执行
let j1 = schedule.scheduleJob('42 * * * *', function(){
    console.log('The answer to life, the universe, and everything!');
});

// 指定具体的时间

// 定义一个未来的时间
let date = new Date(2016, 6, 13, 15, 50, 0);

// 定义一个任务
let j2 = schedule.scheduleJob(date, () => {
    console.log(new Date());
});

// 隔一段时间执行一次
let rule = new schedule.RecurrenceRule();
rule.second = [0,20, 40,]; // 每隔 10 秒执行一次

// 启动任务
let job = schedule.scheduleJob(rule, () => {
    console.log(new Date());
});

// 取消任务

job.cancel()
