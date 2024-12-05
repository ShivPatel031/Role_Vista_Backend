import { isValidObjectId } from "mongoose";
// To validate name
const validateName = (name)=>
{
    const nameRegex = /^[A-Za-z\s]{1,50}$/;

    return nameRegex.test(name);
}

// To validate mobile number
const validateMobileNumber = (mobile) => 
{
    const mobileRegex = /^[1-9]\d{9}$/;

    return mobileRegex.test(mobile);
};

// to validate email
const validateEmail = (email) => 
{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
};

// to validate role
const validateRole = (role)=>
{
    return (role === "student" || role === "teacher" )? true : false ;
}

// to validate gender
const validateGender = (gender)=>
{
    return (gender === "male" || gender === "female" || gender === "other")? true : false ;
}

// to validate branch
const validateBranch = (branch)=>
{
    return (branch === "cse" || branch === "electric" || branch === "mechanical") ? true : false ;
}

// to validate password
const validatePassword = (password)=>
{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    return passwordRegex.test(password);

}

// to validate id
const validateId = (id) => 
{
    return isValidObjectId(id)
};

const validateDOB = (dob) => 
{
    const dobRegex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return dobRegex.test(dob);
};

export {
            validateMobileNumber,
            validateName,
            validateEmail,
            validateBranch,
            validateGender,
            validatePassword,
            validateRole,
            validateId,
            validateDOB
        };

// console.log(validateDOB("2003-03-31"));