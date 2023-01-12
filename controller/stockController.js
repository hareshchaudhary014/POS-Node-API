const db = require("../connection");
require("dotenv").config();
const fs = require("fs");

module.exports.addUniversity = (req, res) => {
  console.log(JSON.parse(req.body.stocks))

  let coursesArray = [];
  JSON.parse(req.body.stocks).map((co) => {
    const newArray = [
      result.insertId,
      co.course,
      co.duration,
      co.fee,
      co.language,
      co.admission,
    ];
    coursesArray = [...coursesArray, newArray];
  });
  console.log(coursesArray)
  // const insertQuery = `INSERT INTO  university_courses(university,course,duration,fee,language,admission) VALUES ?`;
  // db.query(insertQuery, [coursesArray], (err, result) => {
  //   if (result) {
  //     // sending success response
  //     res.status(200).json({ message: "Data Added Successfully" });
  //   } else if (err) {
  //     // sending error response
  //     console.log(err);
  //     res.status(400).json({ message: "Some Problems Occured" });
  //   }
  // });
};

module.exports.editUniversity = (req, res) => {
  const { id } = req.params;
  let data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    description: req.body.description,
    uni_logo_text: req.body.uni_logo_text,
    uni_img_text: req.body.uni_img_text,
    // link: req.body.uni_link,
    // logo: req.files ? req.files?.logo[0]?.filename : "",
    // cover: req.files ? req.files?.cover[0]?.filename : "",
  };
  if (req.c_filename) {
    // imageDelete(newsId)
    //Checks if the file is selected or not
    data["logo"] = req.c_filename;
    deleteFile1(id, "logo"); // delete old file
  }
  if (req?.files?.cover) {
    // imageDelete(newsId)
    //Checks if the file is selected or not
    data["cover"] = req.files?.cover[0].filename;
    deleteFile1(id, "cover"); // delete old file
  }
  const insertQuery = `UPDATE universities SET ? WHERE id= ${req.params.id}`;
  db.query(insertQuery, data, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "Some Problems Occured" + err });
    } else if (result) {
      let locationArray = [];
      JSON.parse(req.body.location).map((lo) => {
        const newArray = [
          req.params.id,
          lo.country,
          lo.location_name,
          lo.location_link,
        ];
        locationArray = [...locationArray, newArray];
      });
      const insertQuery = `INSERT into university_locations(university,country,location,link) VALUES ?`;
      db.query(insertQuery, [locationArray], (err) => {
        if (err) {
          console.log("Error inserting location " + err);
        } else {
          let coursesArray = [];
          JSON.parse(req.body.courses).map((co) => {
            const newArray = [
              req.params.id,
              co.course,
              co.duration,
              co.fee,
              co.language,
              co.admission,
            ];
            coursesArray = [...coursesArray, newArray];
          });
          const insertQuery = `INSERT INTO  university_courses(university,course,duration,fee,language,admission) VALUES ?`;
          db.query(insertQuery, [coursesArray], (err, result) => {
            if (result) {
              // sending success response
              res.status(200).json({ message: "Data Updated Successfully" });
            } else if (err) {
              // sending error response
              console.log(err);
              res.status(400).json({ message: "Some Problems Occured" + err });
            }
          });
        }
      });
    }
  });
};

module.exports.deleteUniversity = (req, res) => {
  const { id } = req.params;
  const insertQuery = `DELETE FROM universities WHERE id= ${id}`;
  db.query(insertQuery, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "Some Problems Occured" + err });
    } else if (result) {
      deleteFile1(id, "logo");
      deleteFile1(id, "cover");
      deleteAllCourse(id);
      deleteAllLocation(id);
      res.status(200).json({ message: "University Deleted Successful" });
    }
  });
};
function deleteAllLocation(id) {
  const deleteQuery = `DELETE FROM university_locations WHERE university=${id}`;
  db.query(deleteQuery, (err, result) => {
    if (err) {
      // sending error message
      console.log("Data could not be deleted" + err);
    }
  });
}

function deleteAllCourse(id) {
  const deleteQuery = `DELETE FROM university_courses WHERE university=${id}`;
  db.query(deleteQuery, (err, result) => {
    if (err) {
      // sending error message
      console.log("Data could not be deleted" + err);
    }
  });
}

module.exports.editLocation = (req, res) => {
  const id = req.params.id;
  const query = `UPDATE university_locations SET ? WHERE id='${id}' `;
  const values = {
    // country: req.body.country,
    location: req.body.location,
    link: req.body.maps,
  };
  if (req.body.country != undefined) {
    values["country"] = req.body.country;
  }
  db.query(query, [values], (err, result) => {
    if (err) {
      return res.status(400).json({
        message: "Location failed to update " + err,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Successful",
      success: true,
    });
  });
};

module.exports.editCourse = (req, res) => {
  const id = req.params.id;
  const query = `UPDATE university_courses SET ? WHERE id='${id}' `;
  const values = {
    // country: req.body.country,
    duration: req.body.duration,
    fee: req.body.fee,
    language: req.body.language,
    admission: req.body.admission,
  };
  if (req.body.course != undefined) {
    values["course"] = req.body.course;
  }
  db.query(query, [values], (err, result) => {
    if (err) {
      return res.status(400).json({
        message: "Course failed to update " + err,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Successful",
      success: true,
    });
  });
};

function deleteFile1(id, fieldName) {
  const query = `SELECT ${fieldName} from universities WHERE id=${id}`;
  db.query(query, (err, result) => {
    if (result) {
      image = result[0][fieldName];
      const path = `./public/images/${image}`;
      fs.unlink(path, function (err) {
        // deleteing old file
        if (err) {
          console.error(err);
        }
      });
    }
  });
}
module.exports.getUniversity = (req, res) => {
  const query = `SELECT u.id as value,u.name as label,u.link as uni_link,u.description,u.email,CONCAT("${process.env.URL}" , u.logo) as logo,c.name as country FROM universities u JOIN university_locations ul ON ul.university=u.id
    JOIN countries c ON c.id=ul.country
    `;
  db.query(query, (err, result) => {
    if (result) {
      const groupedByCity = {};
      // sending success response
      for (const {
        value,
        description,
        uni_link,
        label,
        email,
        logo,
        country,
      } of result) {
        const cityGroup = (groupedByCity[value] ??= {
          value,
          label,
          email,
          logo,
          description,
          uni_link,
          country: {},
        });
        const bossGroup = (cityGroup.country[country] ??= { name: country });
        // bossGroup.caffes.push({ name })
      }

      const resul = Object.values(groupedByCity).map((o) => ({
        ...o,
        country: Object.values(o.country),
      }));

      res.status(200).json({ data: resul, message: "Data Fetch Successfully" });
    } else if (err) {
      // sending error response
      console.log(err);
      res.status(400).json({ message: "Data Fetch Failed" });
    }
  });
};

module.exports.getUniversityById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT u.id as value,u.name as label,u.description,u.uni_logo_text,u.uni_img_text,
    u.phone as contact,u.email,CONCAT("${process.env.URL}" , u.logo) as logo,
    CONCAT("${process.env.URL}" , u.cover) as cover,
   ul.id as location_id,ul.country,ul.location,ul.link,
   uc.id as course_id,uc.course,uc.duration,uc.fee,uc.language,uc.admission,
    c.name as country_name FROM
    universities u LEFT JOIN university_locations ul
    ON ul.university=u.id
    LEFT JOIN countries c
    ON c.id=ul.country
    LEFT JOIN university_courses uc
    ON uc.university=u.id
    WHERE u.id=${id}
    `;
  db.query(query, (err, result) => {
    if (result) {
      const groupedByCity = {};
      // sending success response
      for (const {
        value,
        description,
        label,
        contact,
        email,
        uni_logo_text,
        uni_img_text,
        logo,
        country_name,
        cover,
        country,
        location,
        link,
        course_id,
        course,
        duration,
        fee,
        location_id,
        language,
        admission,
      } of result) {
        const cityGroup = (groupedByCity[value] ??= {
          value,
          label,
          contact,
          email,
          uni_logo_text,
          uni_img_text,
          logo,
          description,
          cover,
          country: {},
          courses: {},
        });
        const coursesGroup = (cityGroup.courses[course] ??= {
          row_id: course_id,
          course: course,
          duration: duration,
          fee: fee,
          language: language,
          admission: admission,
        });
        const bossGroup = (cityGroup.country[country] ??= {
          row_id: location_id,
          name: country_name,
          country: country,
          location_name: location,
          location_link: link,
        });
        // bossGroup.caffes.push({ name })
      }

      const resul = Object.values(groupedByCity).map((o) => ({
        ...o,
        country: Object.values(o.country),
      }));
      const resu = Object.values(resul).map((o) => ({
        ...o,
        courses: Object.values(o.courses),
      }));

      res
        .status(200)
        .json({ data: resu[0], message: "Data Fetch Successfully" });
    } else if (err) {
      // sending error response
      console.log(err);
      res.status(400).json({ message: "Data Fetch Failed" });
    }
  });
};

module.exports.deleteLocation = (req, res) => {
  const { id } = req.params;
  const deleteQuery = `DELETE FROM university_locations WHERE id=${id}`;
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

module.exports.deleteCourse = (req, res) => {
  const { id } = req.params;
  const deleteQuery = `DELETE FROM university_courses WHERE id=${id}`;
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
