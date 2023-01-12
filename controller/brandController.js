const db = require("../connection");
const slug = require("slug");

require("dotenv").config();

module.exports.addBrand = (req, res) => {
    const slugs= slug(req.body.brand)
    let data = {
        title: req.body.brand,
        slug: slugs

    }
    const query = `INSERT INTO brands SET ?`;
    db.query(query, data, (err, result) => {
        if (result) {
            // sending success response
            res.status(200).json({ message: "Brand Added Successfully" });
        } else if (err) {
            // sending error response
            if (err?.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ message: "Brand  already exists", type: 'duplicate' });
            }
            else {
                res.status(400).json({ message: "Data Couldnot be  added" });
            }
        }
    });
}

module.exports.getBrand = (req, res) => {
    const query = `SELECT * FROM brands`
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
}

module.exports.getBrandById = (req, res) => {
    const { id } = req.params;
    const query = `SELECT id as value,title as label FROM brands where id=${id}`
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
}

module.exports.updateBrand = (req, res) => {
    const { slug } = req.params;
    let data = {
        title: req.body.title
    }
    const query = `UPDATE brands SET ? WHERE slug=?`;
    db.query(query, [data, slug], (err, result) => {
        if (result) {
            // sending success response
            res.status(200).json({ message: "Data Updated Successfully" });
        } else if (err) {
            // sending error response
            console.log(err);
            if (err?.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ message: "Brand title already exists", type: 'duplicate' });
            }
            else {
                res.status(400).json({ message: "Data Couldnot be  updated" });
            }
        }
    });
}
module.exports.updateStatus = (req, res) => {
    const { slug } = req.params;
    let data = {
      status: req.body.status,
    };
    const query = `UPDATE brands SET ? WHERE slug=?`;
    db.query(query, [data, slug], (err, result) => {
      if (result) {
        // sending success response
        res.status(200).json({ message: "Status Updated Successfully" });
      } else {
        res.status(400).json({ message: "Soething went wrong !" });
      }
    });
  };
module.exports.deleteBrand = (req, res) => {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM brands WHERE id=${id}`;
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
}