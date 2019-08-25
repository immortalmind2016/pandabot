let Bot = require("../../../model/Bot")
let Block_template = require("../../../model/Block_template")
let Block=require("../../../model/Block")
// Start blocks
const createBlock = async (req, res, err) => {


    const bot = await Bot.findOne({
        $and: [{
            _id: req.params.botid
        }]
    })

    if (bot) {
        const blockData = req.body.data
        if (req.body.data.name && req.body.data) {
            let block = new Block({
                ...blockData,
                bot: req.params.botid
            })
            block.save()
            return res.json({
                block
            })
        }



    }

    res.sendStatus(404)


}

const removeBlock = async (req, res, err) => {
    const bot = await Bot.findOne({
        $and: [{
            user_id: req.user._id
        }, {
            _id: req.params.botid
        }]
    })
    if (bot) {

        await Block.findOneAndDelete({
            $and: [{
                _id: req.params.blockid
            }, {
                bot: req.params.botid
            }]
        })

        return res.sendStatus(200)





    }

    res.sendStatus(404)


}
const editBlock = async (req, res, err) => {
    const bot = await Bot.findOne({
        $and: [{
            user_id: req.user._id
        }, {
            _id: req.params.botid
        }]
    })
    if (bot) {
        const blockData = req.body.data

        const block = await Block.findOneAndUpdate({
            $and: [{
                bot: req.params.botid
            }, {
                _id: req.params.blockid
            }]
        }, {
            ...blockData
        }, {
            new: true
        })


        return res.json({
            block
        })

    }
    res.sendStatus(404)


}
const getBlocks = async (req, res, err) => {
    const bot = await Bot.findOne({
        $and: [{
            user_id: req.user._id
        }, {
            _id: req.params.botid
        }]
    })
    if (bot) {

        const blocks = await Block.find({
            bot: req.params.botid
        })

        return res.json({
            blocks
        })

    }

    res.sendStatus(404)


}
const getBlock = async (req, res, err) => {
    const bot = await Bot.findOne({
        $and: [{
            user_id: req.user._id
        }, {
            _id: req.params.botid
        }]
    })
    if (bot) {
        const block = await Block.findOne({
            $and: [{
                bot: req.params.botid
            }, {
                _id: req.params.blockid
            }]
        })
        if (block) {

            const templates = await Block_template.find({
                block: block._id
            })

            return res.json({
                block,
                templates
            })

        }




    }

    res.sendStatus(404)



}
// end blocK
// Start Block Template
const createBlockTemplate = async (req, res, err) => {
    const bot = await Bot.findOne({
        $and: [{
            _id: req.params.botid
        }]
    })
    if (bot) {
        const templateDate = req.body.data

        try {
            if (templateDate.message)
                templateDate.message = templateDate.message != "" ? JSON.stringify(templateDate.message) : templateDate.message


            const block = await Block.findOne({
                $and: [{
                    bot: bot._id
                }, {
                    _id: req.params.blockid
                }]
            })

            if (!!block) {

                let template = new Block_template({
                    ...templateDate,
                    block: block._id
                })
                await template.save()
                if (template.message)
                    template.message = JSON.parse(template.message)
                return res.json({
                    template
                })

            }


        } catch (e) {
            return res.send(e)
        }


    }

    res.sendStatus(404)


}

const removeBlockTemplate = async (req, res, err) => {
    const bot = await Bot.findOne({
        $and: [{
            user_id: req.user._id
        }, {
            _id: req.params.botid
        }]
    })
    if (bot) {

        const block = await Block.findOne({
            $and: [{
                bot: bot._id
            }, {
                _id: req.params.blockid
            }]
        })
        if (!!block) {
            const block_template = await Block_template.findOneAndRemove({
                $and: [{
                    _id: req.params.templateid
                }, {
                    block: block._id
                }]
            })

            if (block_template)
                return res.sendStatus(200)


        }

    }

    res.sendStatus(404)


}
const editBlockTemplate = async (req, res, err) => {
    const templateDate = req.body.data
    if (templateDate.message != "")
        templateDate.message = templateDate.message != "" ? JSON.stringify(templateDate.message) : templateDate.message



    const bot = await Bot.findOne({
        $and: [{
            user_id: req.user._id
        }, {
            _id: req.params.botid
        }]
    })
    if (bot) {
        const block = await Block.findOne({
            $and: [{
                bot: bot._id
            }, {
                _id: req.params.blockid
            }]
        })
        if (!!block) {
            const template = await Block_template.findOneAndUpdate({
                $and: [{
                    _id: req.params.templateid
                }, {
                    block: block._id
                }]
            }, {
                ...templateDate
            }, {
                new: true
            })

            return res.json({
                template
            })

        }

    }

    res.sendStatus(404)

}
// end Block Template
module.exports = {
    createBlock,
    removeBlock,
    editBlock,
    getBlock,
    getBlocks,
    editBlockTemplate,
    createBlockTemplate,
    removeBlockTemplate

}