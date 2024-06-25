async function checkType(mail, password, firstName, lastName, description) {

    const mailRegExp = new RegExp("^[a-zA-Z0-9_!#$%&amp;'*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&amp;'*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$");
    const passwordRegExp = new RegExp("^(.*[a-zA-Z0-9!@#$%^&*]){1,16}$");


if (description) {

    if (typeof firstName !== "string" || typeof lastName !== "string" || typeof mail !== "string" || typeof password !== "string" || typeof description !== "string") {
        return res.status(422).json({message: "Un ou plusieurs champs ne sont pas du bon type"})
    }
    if (firstName === "" || lastName === "" || mail === "" || password === "" || description === "") {
        return res.status(422).json({message: "Un ou plusieurs champs sont vides"})
    }
    if (!mailRegExp.test(mail) ) {
        return res.status(422).json({message: "Adresse mail ou mot de passe incorrect"});
    }
    
    if (!passwordRegExp.test(password)) {
        return res.status(422).json({message: "Votre mot de passe doit comporter au moins 4 caractères avec 1 lettre, 1 chiffre et 1 caractère spécial"});
    }
    
    
} else if (firstName) {


    if (typeof(firstName) !== "string" || typeof(lastName) !== "string" ||
    typeof(mail) !== "string" || typeof(password) !== "string") {
       return res.status(422).json({message: "Un ou plusieurs champs ne sont pas du bon type"})
    }
    if (firstName === "" || lastName === "" || mail === "" || password === "") {
       return res.status(422).json({message: "Un ou plusieurs champs sont vides"})
    }
    if (!mailRegExp.test(mail) ) {
       return res.status(422).json({message: "Adresse mail ou mot de passe incorrect"});
    }
    if (!passwordRegExp.test(password)) {
        return res.status(422).json({message: "Votre mot de passe doit comporter au moins 4 caractères avec 1 lettre, 1 chiffre et 1 caractère spécial"});
    }
} else {


if (typeof(mail) !== "string" || typeof(password) !== "string") {
    return res.status(422).json({message: "Un ou plusieurs champs ne sont pas du bon type"});
}
if (mail === "" || password === "") {
    return res.status(422).json({message: "Un ou plusieurs champs sont vides"});
}
if (!mailRegExp.test(mail) ) {
    return res.status(422).json({message: "Adresse mail ou mot de passe incorrect"});
}

if (!passwordRegExp.test(password)) {
    console.log(passwordRegExp.test(password));
    return res.status(422).json({message: "Votre mot de passe doit comporter au moins 4 caractères avec 1 lettre, 1 chiffre et 1 caractère spécial"});
}
}

}










module.exports = checkType;