const Schedule = require("../model/Schedule");
const delayarr = require("delay-for-array");
const dJSON = require("dirty-json");
const Bot = require("../model/Bot");
const Page = require("../model/Page");
const MessengerUser = require("../model/Messenger_user");
const moment = require("moment");
const broadCast=require("../helpers/broadcast"); 

let scheds = []
/*
Schedule.find({},(err,schedules)=>{
    scheds=schedules
})
*/
process.on("message", (schedule) => {
    scheds.push(schedule)
})

setInterval(() => {
    if(scheds.length!=0)
    delayarr.each(
        scheds,
        { time: 3 },
        function (schedule, k) {
            // Now date , day , time 

            let date = moment().format("YYYY-MM-DD");
            let time = moment().format("HH:mm");
            time = moment(time, "HH:mm");
            let day = moment().format("ddd");

            // end 
            // schedule times 
            const start_date = moment(schedule.start_date, "YYYY-MM-DD");
            const end_date = moment(schedule.end_date, "YYYY-MM-DD");
            let start_time = moment(schedules[k].time, "HH:mm");
            //end schedule times
            if (
                !scheds[k].sent &&
                (moment(start_time).isSame(time) &&
                    (schedule.day == day || (moment(date).isBetween(moment(start_date), moment(end_date)) || moment(date).isSame(moment(start_date)) || moment(date).isSame(moment(end_date)))))
            ) {
                scheds[k].sent = true;
                Schedule.findOneAndUpdate(
                    { _id: scheds[k]._id },
                    { sent: true },
                    () => { }
                );
                Page.findOne({ user: userId }, (err, page) => {
                    if (page) {
                        // convert TexT TO Json 
                        const rr = dJSON.parse(scheds[k].message);
                        const accessToken = page.accessToken;
                        const messages = JSON.parse(
                            JSON.stringify(rr).replace("\n", "\\n")
                        );
                        // end convert TexT TO Json 

                        MessengerUser.find({ page: page._id }).lean()
                            .cursor().on("data", users => {
                                let usersArr = users
                                // Start Batching 
                                while (usersArr.length != 0) {
                                    var insideArr = usersArr.splice(0, 50)
                                    batches[batchNo] = insideArr
                                    batchNo++;
                                }
                                var index = 0;
                                const sendInterval = setInterval(() => {

                                    broadCast.sendToAll(batches[index], messages, page).then((data) => {

                                        counter += batches[index].length;

                                        if (counter % 100000 == 0) {
                                            console.log("COUNTER : ", counter)
                                            console.log("DATA ", data)
                                            Schedule.findOneAndUpdate({ _id: scheds[k]._id }, { numbers: counter, done: true, progress: false }, (err, sch) => {

                                                //  console.log("DONE")
                                            });


                                        }
                                        if (index == batches.length - 1) {

                                            Schedule.findOneAndUpdate({ _id: scheds[k]._id }, { numbers: counter, done: true, progress: false }, (err, sch) => {

                                                //  console.log("DONE")
                                            });

                                        }



                                    }).catch((e) => {
                                        console.log(e)
                                    })


                                    if (index == batches.length - 1) {
                                        console.log("CLEAAAR ")
                                        clearInterval(sendInterval)
                                    } else {
                                        index++;
                                    }

                                }, 20)
                                /* End Batching */

                            })
                    }
                })
            }


        })

}, 5000)

