// models
const Counter = require("../resources/global/counter/model");

// features
const AppError = require("../services/appError");

// lib
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");

exports.pagesCount = (e) => {
  return Math.ceil(e / 10);
};

exports.pagesCountHalf = (e) => {
  return Math.ceil(e / 5);
};

exports.counters = async (req, name) => {
  let counterNum;
  const counter = await Counter.findOne({
    accountAdmin: req.user.accountAdmin,
    name: name,
  });
  if (!counter) {
    const counter = await Counter.create({
      accountAdmin: req.user.accountAdmin,
      name: name,
    });
    counterNum = counter.counter;
  } else {
    counterNum = counter.counter;
  }
  return counterNum;
};

exports.addCounter = async (req, name) => {
  const counterData = await Counter.findOne({
    accountAdmin: req.user.accountAdmin,
    name: name,
  });
  let counterNum = counterData.counter;
  counterData.counter = counterNum + 1;
  await counterData.save();
};

exports.exportRfqHeaderToExcel = (
  header,
  workSheetColumnNames,
  workSheetName,
  filePath
) => {
  let data = [];
  for (let i = 0; i < header.length; i++) {
    data.push(header[i].dataModel);
  }

  // create new work book
  const workBook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.aoa_to_sheet([]);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.utils.sheet_add_aoa(workSheet, [workSheetColumnNames], { origin: "A1" });
  xlsx.utils.sheet_add_aoa(workSheet, [data], { origin: "A2" });
  xlsx.writeFile(workBook, path.resolve(filePath));
  return true;
};

exports.exportRfqItemToExcel = (
  item,
  workSheetColumnNames,
  workSheetName,
  filePath
) => {
  // create new work book
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, item];
  const workSheet = xlsx.utils.json_to_sheet(item);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
  return true;
};

exports.sortArray = (array, prop, sorting) => {
  if (!prop || !sorting) {
    return array;
  } else {
    if (sorting == 1) {
      return array.sort((a, b) => {
        if (a[prop] < b[prop]) {
          return -1;
        } else if (a[prop] > b[prop]) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (sorting == -1) {
      return array.sort(function (a, b) {
        if (a[prop] > b[prop]) {
          return -1;
        }
        if (a[prop] < b[prop]) {
          return 1;
        }
        return 0;
      });
    }
  }
};

exports.paginateArray = (array, page, pageSize) => {
  if (!page || !pageSize) {
    return array;
  } else {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return array.slice(startIndex, endIndex);
  }
};
