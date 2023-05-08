const { PrismaClient, Prisma } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function write_topic(msg, auth){
    let topic = await prisma.topic.create({
        data: {
            content: msg,
            author: auth,
        }
    });
};

async function count_topics(){
    let topics = await prisma.topic.findMany({
        where: {
            chosen: false
        }
    });
    
    count = topics.length;
    return new Promise(resolve => {
        resolve(count);
    }, "err: timeout");
};

async function count_topics_by_author(author){
    if(author === null){
        return 0; //Return zero to prevent crash.
    }

    let topics = await prisma.topic.findMany({
        where: {
            author: author,
        }
    });

    let topics_closed = await prisma.topic.findMany({
            where: {
                chosen: true,
                author: author
            }
        });
    
    count_total = topics.length;
    count_closed = topics_closed.length;
    return new Promise(resolve => {
        resolve([count_total, count_closed]);
    }, "err: timeout");
};

async function get_topics_by_author(author){
    let topics = await prisma.topic.findMany({
        where: {
            author: author,
        }
    })

    return new Promise(resolve => {
        resolve(topics);
    }, "err: timeout");
}

async function get_topic(){
    let topic = await prisma.$queryRaw`SELECT * FROM Topic WHERE chosen=FALSE ORDER BY RANDOM() LIMIT 1`;
    try{
        await prisma.topic.update({
            where: {
                id: topic[0].id
            },
            data: {
                chosen: true
            }
        });
    } catch (err){
        console.log("Error, topic update didn't happen.");
        topic = [{author: 'err', content:'there was an error.'}];
    }
    
    return new Promise(resolve => {
        resolve(topic);
    }, "err: timeout");
};

module.exports = {
    write_topic, get_topic, count_topics, count_topics_by_author, get_topics_by_author
};
