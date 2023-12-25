const AppError = require('./appError')
var validator = require('validator');



exports.isValidString = (x,next) => {

if (typeof x === "string") {
  return true ;
} else {
  return next (new AppError(
    "This is not a valid string ,هذا النص غير صحيح ",
    400
    )
    );
}

}

exports.isValidNumber = (x , next) => {
  if (isNaN(x)) {
    
    return next( new AppError(
    "This is not a valid number ,هذا الرقم غير صحيح ",
    400
    )
    );
} else {
    return true;
}
}

exports.isValidDate = (x , next) => {
var d_reg =/(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;

if (d_reg.test(x)) {
    return true;
}
else{
    return next( new AppError(
    "This is not a valid date ,هذا التاريخ غير صحيح ",
    400
    )
    );
}
}

exports.isValidBoolean = (x , next) => {
if( x === false || x === true) {
  return true;
}
else{
  return next( new AppError(
  "This is not a valid boolean ,من فضلك ادخل بيانات متوافقة مع نوعها",
  400
  )
  );
}
}

exports.isValidArray = (x , next) => {
var length=x.length;

  if (length==0){
      return next( new AppError(
          "This is not a valid array ,هذه المجموعة غير صحيحة",
          400
          )
          );
  }else{
      return true;
  }

}

exports.isEmail = (x ,next) => {
if(validator.isEmail(x)){
  return true;
}
else {
  return next (new AppError(
  "This is not a valid email ,هذا الايميل غير صحيح ",
  400
  )
  );
}
}

exports.isUrl = (x ,next) => {
if(validator.isURL(x,{protocols: ['http','https','ftp'],validate_length: true})){
  return true;
}
else {
  return next (new AppError(
  "This is not a valid url ,هذا اللينك غير صحيح ",
  400
  )
  );
}
}

exports.isTime = (x , next) => {
if(validator.isTime(x)){
  return true;
}
else {
  return next (new AppError(
  "This is not a valid time ,هذا الوقت غير صحيح ",
  400
  )
  );
}
}

exports.isPostalCode = (x ,next) => {
  if(validator.isPostalCode(x, locale)){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid code ,هذا الكود غير صحيح ",
    400
    )
    );
}
}

exports.isMobilePhone = (x,next) => {
var phoneno = /^\d{10}$/;

if(x.match(phoneno)){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid mobile phone ,هذا الهاتف غير صحيح ",
    400
    )
    );
}
}

exports.isLength = (x ,i,next) => {
if(validator.isLength(x,{min :`${i.validation.val.min}` , max:`${i.validation.val.max}`})){
  return true;
}
else {
  return next (new AppError(
  "This is not a valid string ,هذا النص غير صحيح ",
  400
  )
  );
}
}

exports.isCurrency = (x ,next) => {
  if(validator.isCurrency(x)){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid currency ,هذه العملة غير صحيحة ",
    400
    )
    );
}
}

exports.isDecimal = (x, next) => {
  if(validator.isDecimal(x)){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid decimal number ,هذا الرقم غير صحيح ",
    400
    )
    );
}
}

exports.dateValidation =(x,next) => {
  if(validator.isDate(x)){
  return true;
  }
  else {
  return next (new AppError(
    "This is not a valid date ,هذا التاريخ غير صحيح ",
    400
    )
    );
  }
}

exports.greaterThan = (x,i,next) => {
  if(x > i.validation.val){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid number ,هذا الرقم غير صحيح ",
    400
    )
    );
}
}

exports.greaterThanOrEqual = (x,i,next) => {
  if(x >= i.validation.val){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid number ,هذا الرقم غير صحيح ",
    400
    )
    );
}
}

exports.lessThan =(x,i,next) => {
  if(x < i.validation.val){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid number ,هذا الرقم غير صحيح ",
    400
    )
    );
}
}

exports.lessThanOrEqual = (x,i,next) => {
  if(x <= i.validation.val){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid number ,هذا الرقم غير صحيح ",
    400
    )
    );

}
}

exports.equal = (x,i,next) => {
  if(x == i.validation.val){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid number ,هذا الرقم غير صحيح ",
    400
    )
    );
}
}

exports.notEqual = (x,i,next) => {
  if(x != i.validation.val){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid number ,هذا الرقم غير صحيح ",
    400
    )
    );
}
}

exports.isPdf = (x,next) => {

var ext = x.substring(x.lastIndexOf('.') + 1);
if(ext == "pdf" ){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid pdf file ,هذا الملف غير صحيح ",
    400
    )
    );
}
}

exports.isWord = (x , next) => {
  var ext = x.substring(x.lastIndexOf('.') + 1);
if(ext == "docx" ){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid word file ,هذا الملف غير صحيح ",
    400
    )
    );
}
}

exports.isPhoto = (x, next) => {
var validExtensions = ['jpg','png','jpeg'];
var fileNameExt = x.substring(x.lastIndexOf('.') + 1);

if (!validExtensions.includes(fileNameExt)) {
    
    return next (new AppError(
        "Only these file picture types are accepted jpg-png-jpeg ,jpg-png-jpeg انواع ملفات الصور هذه هى التى فقط متاحة",
        400
    ));
}
else {
    return true;
}
}

exports.isExcel = (x, next) => {
  var ext = x.substring(x.lastIndexOf('.') + 1);
if(ext == "xlsx" ){
    return true;
}
else {
    return next (new AppError(
    "This is not a valid excel file ,هذا الملف غير صحيح ",
    400
    )
    );
}
}
