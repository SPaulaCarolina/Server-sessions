module.export = function checkAuth(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.redirect('/auth/login')
}