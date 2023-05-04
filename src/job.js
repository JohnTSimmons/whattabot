require('dotenv').config();
const schedule = require('node-schedule');
const { get_topic, count_topics } = require('./database.js');
const { get_date } = require('./date_helper.js');

post_rule = new schedule.RecurrenceRule();
post_rule.dayOfWeek = Number(process.env.POST_DAY_OF_WEEK);
post_rule.hour = Number(process.env.POST_HOUR);
post_rule.minute = Number(process.env.POST_MINUTE);
post_rule.tz = process.env.TIME_ZONE;

check_rule = new schedule.RecurrenceRule();
check_rule.dayOfWeek = Number(process.env.CHECK_DAY_OF_WEEK);
check_rule.hour = Number(process.env.CHECK_HOUR);
check_rule.minute = Number(process.env.CHECK_MINUTE);
check_rule.tz = process.env.TIME_ZONE;

async function send_topic(topic, channel){
    auth = topic[0].author;
    content = topic[0].content;
    channel.send("@everyone" + ' ' + auth + ' asked the following topic:');
    channel.send(content);
}

async function post_topic(channel){
    const topic_channel = channel;
    const sendTopicOnceResolved = (topic, send_channel) => {
        send_topic(topic, send_channel)
    }
    const topic = await get_topic().then((response) => {
        sendTopicOnceResolved(response, topic_channel)
    })

}

async function start_job(guild, chan){
    const post_job = schedule.scheduleJob(post_rule, function(){
        date = get_date();
        guild.channels.create({
            name: date,
            parent: process.env.WEEKLY_TOPIC_GROUP_ID
        }).then(topic_channel => (
            post_topic(topic_channel)
        )).then(
            guild.channels.create({
                name: date,
                parent: process.env.PROGRESS_REPORT_GROUP_ID
            }).then(progress_channel => {
                progress_channel.send("@everyone" + "time to share your progress report!")
            })
        );
    });

    const check_job = schedule.scheduleJob(check_rule, function(){
        const is_zero = (count) => {
            if( count === 0 ){
                return true;
            };
        };
        count = count_topics().then((response) => {
            is_zero(response)
        })
        const chan = guild.channels.cache.get(process.env.MAIN_TEXT_CHANNEL_ID);
        if(is_zero){
            chan.send('@everyone' + ' There is no topic to discuss! Please add a topic with /addtopic!');
        }
    });
}

module.exports = {
    start_job
}