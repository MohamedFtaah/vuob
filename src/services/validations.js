var validator = require('validator');
const AppError = require('./appError')

const {
     isValidString,
    isValidNumber,
    isValidDate,
    isValidBoolean,
    isValidArray,
    isEmail,
    isUrl,
    isTime,
    isPostalCode,
    isMobilePhone,
    isLength,
    isCurrency,
    isDecimal,
    dateValidation,
    greaterThan,
    greaterThanOrEqual,
    lessThan,
    lessThanOrEqual,
    equal,
    notEqual,
    isPdf,
    isWord,
    isPhoto,
    isExcel
} = require('./validationFunctions')

exports.rfqValidationHeader = (header,next) => {

// validate with required
header.forEach((i) => {
    
    if(i.required == true && i.dataModel == (undefined || "")) {
        return next (new AppError(
            `هذا الحقل مطلوب ${i.name}`,
            400
            )
            );
    } else {
        return true ;
    }
})
// validate with type
header.forEach((i) => {
    
switch(i.dataType) {
// i.dataModel
case "String":

isValidString(i.dataModel,next)

break;
case "Number":
isValidNumber(i.dataModel,next)

break;
case "Date":
isValidDate(i.dataModel,next)

break;
case "Boolean":
isValidBoolean(i.dataModel,next)
break;
case "Array":
isValidArray(i.dataModel,next)
break;
case "File":
    return true;
    break;
default:
return next(new AppError(
    "This type does not exist,هذا النوع غير موجود",
    400
    )
);

}

})

//validate with it's validations
header.forEach((i) => {

switch(i.validation.action) {
    
case "isEmail" :
    isEmail(i.dataModel,next)
break;
case "isUrl" :
    isUrl(i.dataModel,next)
break;
case "isTime" :
    isTime(i.dataModel,next)
break;
case "isPostalCode" :
    isPostalCode(i.dataModel,next)
break;
case "isMobilePhone" :
    isMobilePhone(i.dataModel,next)
break;
case "islength" :
    isLength(i.dataModel,i,next)
break;
case "isCurrency" :
    isCurrency(i.dataModel,next)
break;
case "decimal" :
    isDecimal(i.dataModel,next)
break;
case "isValidDate" :
    dateValidation(i.dataModel,next)
break;
case ">" :
    greaterThan(i.dataModel,i,next)
break;
case ">=" :
    greaterThanOrEqual(i.dataModel,i,next)
break;
case "<" :
    lessThan(i.dataModel,i,next)
break;
case "<=" :
    lessThanOrEqual(i.dataModel,i,next)
break;
case "==" :
    equal(i.dataModel,i,next)
break;
case "!=" :
    notEqual(i.dataModel,i,next)
break;
case "isPdf" :
    isPdf(i.dataModel,next)

break;
case "isWord" :
    isWord(i.dataModel,next)
break;
case "isPhoto" :
    isPhoto(i.dataModel,next)

break;
case "isExcel" :
    isExcel(i.dataModel,next)
break;
default:
return true;

}

})

};

exports.rfqValidationItem = (item,next) => {
   
const [ite, ...other] = item;
    
// validate with required
ite.forEach((e) => {
    other.forEach((i)=> {
        for (const [key, value] of Object.entries(i)) {
            if(key == e.name) { 
                if(e.required == true && value == (undefined || "")) {
                    return next (new AppError(
                        `هذا الحقل مطلوب ${key}`,
                        400
                        )
                        );
                } else {
                    return true ;  
                }
                    
            }
        }
    })
})
    
// validate with data type
ite.forEach((e) => {
    other.forEach((i)=> {
        for (const [key, value] of Object.entries(i)) {
            if(key == e.name) { 
                
                switch(e.dataType) {

                    case "String":
                    isValidString(value,next)
                    break;

                    case "Number":
                    isValidNumber(value,next)
                    break;

                    case "Date":
                    isValidDate(value,next)
                    break;

                    case "Boolean":
                    isValidBoolean(value,next)
                    break;

                    case "Array":
                    isValidArray(value,next)
                    break;

                    case "File":
                    return true;
                    break;

                    default:
                    return next(new AppError(
                        "This type does not exist,هذا النوع غير موجود",
                        400
                        )
                    );
                    
                    }
                
            }
        }
    })
})

//validate with validation
ite.forEach((e) => {
    other.forEach((i)=> {
        for (const [key, value] of Object.entries(i)) {
            if(key == e.name) { 
                
                switch(e.validation.action) {
    
                    case "isEmail" :
                        isEmail(value,next)
                    break;
                    case "isUrl" :
                        isUrl(value,next)
                    break;
                    case "isTime" :
                        isTime(value,next)
                    break;
                    case "isPostalCode" :
                        isPostalCode(value,next)
                    break;
                    case "isMobilePhone" :
                        isMobilePhone(value,next)
                    break;
                    case "islength" :
                        isLength(value,e,next)
                    break;
                    case "isCurrency" :
                        isCurrency(value,next)
                    break;
                    case "decimal" :
                        isDecimal(value,next)
                    break;
                    case "isValidDate" :
                        dateValidation(value,next)
                    break;
                    case ">" :
                        greaterThan(value,e,next)
                    break;
                    case ">=" :
                        greaterThanOrEqual(value,e,next)
                    break;
                    case "<" :
                        lessThan(value,e,next)
                    break;
                    case "<=" :
                        lessThanOrEqual(value,e,next)
                    break;
                    case "==" :
                        equal(value,e,next)
                    break;
                    case "!=" :
                        notEqual(value,e,next)
                    break;
                    case "isPdf" :
                        isPdf(value,next)
                    
                    break;
                    case "isWord" :
                        isWord(value,next)
                    break;
                    case "isPhoto" :
                        isPhoto(value,next)
                    
                    break;
                    case "isExcel" :
                        isExcel(value,next)
                    break;
                    default:
                    return true;
                    
                    }   
            }
        }
    })
})
    
    
};