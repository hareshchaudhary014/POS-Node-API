const db = require("../connection");
const slug = require("slug");
require("dotenv").config();

module.exports.addCategory = (req, res) => {
  const slugs = slug(req.body.category);
  let data = {
    title: req.body.category,
    slug: slugs,
  };
  const query = `INSERT INTO categories SET ?`;
  db.query(query, data, (err, result) => {
    if (result) {
      // sending success response
      res.status(200).json({ message: "Category Added Successfully" });
    } else if (err) {
      // sending error response
      if (err?.code === "ER_DUP_ENTRY") {
        res
          .status(400)
          .json({ message: "Category  already exists", type: "duplicate" });
      } else {
        res.status(400).json({ message: "Data Couldnot be  added" });
      }
    }
  });
};

module.exports.getCategory = (req, res) => {
  const query = `SELECT * FROM categories`;
  db.query(query, (err, result) => {
    if (result) {
      // sending success response
      res
        .status(200)
        .json({ data: result, message: "Data Fetch Successfully" });
    } else if (err) {
      // sending error response
      console.log(err);
      res.status(400).json({ message: "Data Fetch Failed" });
    }
  });
};

module.exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT id as value,title as label FROM categories where id=${id}`;
  db.query(query, (err, result) => {
    if (result) {
      // sending success response
      res
        .status(200)
        .json({ data: result, message: "Data Fetch Successfully" });
    } else if (err) {
      // sending error response
      console.log(err);
      res.status(400).json({ message: "Data Fetch Failed" });
    }
  });
};

module.exports.updateCategory = (req, res) => {
  const { id } = req.params;
  let data = {
    title: req.body.title,
  };
  const query = `UPDATE categories SET ? WHERE id=?`;
  db.query(query, [data, id], (err, result) => {
    if (result) {
      // sending success response
      res.status(200).json({ message: "Data Updated Successfully" });
    } else if (err) {
      // sending error response
      console.log(err);
      if (err?.code === "ER_DUP_ENTRY") {
        res
          .status(400)
          .json({
            message: "Category title already exists",
            type: "duplicate",
          });
      } else {
        res.status(400).json({ message: "Data Couldnot be  updated" });
      }
    }
  });
};

module.exports.updateStatus = (req, res) => {
  const { slug } = req.params;
  let data = {
    status: req.body.status,
  };
  const query = `UPDATE categories SET ? WHERE slug=?`;
  db.query(query, [data, slug], (err, result) => {
    if (result) {
      // sending success response
      res.status(200).json({ message: "Status Updated Successfully" });
    } else {
      res.status(400).json({ message: "Soething went wrong !" });
    }
  });
};

module.exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  const deleteQuery = `DELETE FROM categories WHERE id=${id}`;
  db.query(deleteQuery, (err, result) => {
    if (result) {
      // sending success message
      res.status(200).json({ message: "Data Deleted Successfully" });
      // res.sendStatus(200)
    } else if (err) {
      // sending error message
      res.status(400).json({ message: "Data could not be deleted" });
    }
  });
};
