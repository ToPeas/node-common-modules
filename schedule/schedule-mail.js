const schedule = require('node-schedule');
const { main } = require('../mail')
// 这个每天定时什么时刻执行
// let j1 = schedule.scheduleJob('42 * * * *', function(){
//     console.log('The answer to life, the universe, and everything!');
// });

// 定义规则
let rule = new schedule.RecurrenceRule();
rule.second = [0,20, 40]; // 每隔 20 秒执行一次

// 启动任务
let job = schedule.scheduleJob(rule, () => {
    console.log(new Date());
    main()
});

