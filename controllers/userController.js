const express = require('express');

const current_user = async (req, res) => {
    res.json({ user: req.user, token: req.token });
}

module.exports = current_user;