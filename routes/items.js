const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require('../fakeDb')


router.get('/', (req, res) => {
    res.json({items})
    

})

router.get('/:name', (req, res, next) => {
    try{
       const foundItem = items.find(item => item.name === req.params.name)
       if(foundItem === undefined) throw new ExpressError('Item not found', 404)
       return res.json(foundItem)

    } catch (e) {
        return next(e)
    }
})

router.post('/', (req, res, next) => {
    try{ 
    if (!req.body.name) throw new ExpressError('Name is required', 400)
    if (!req.body.price) throw new ExpressError('Price is required', 400)
    const price = req.body.price
    items.push({name: req.body.name, price: +price})
    return res.status(201).json({added: {name: req.body.name, price: req.body.price}})
    } catch (e) {
        return next(e)
    }

})

router.patch('/:name', (req, res, next) => {
    try{ 
    let foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) throw new ExpressError('Item not found', 404)
    foundItem.name = req.params.name 
    return res.json({updated : {name: foundItem.name, price: foundItem.price}})
} catch (e) {
    next(e)
}
})

router.delete('/:name', (req, res, next) => {
    try { 
    let foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) throw new ExpressError('Item not found', 404)
    let idx = items.indexOf(foundItem)
    items.splice(idx, 1)
    console.log(items)
    return res.json({message: 'Deleted'})
} catch (e) {
    next(e)
}
})


module.exports = router