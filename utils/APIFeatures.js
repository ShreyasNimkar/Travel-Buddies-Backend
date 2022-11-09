class APIFeatures {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }

  // http://127.0.0.1:8000/cabs/allCabs/gender?="male"/NOoFsEATS=2

  filter() {
    const queryObj = { ...this.queryStr }; // cause queryObj=req.query will pass by reference
    const exlcudeFields = ["page", "sort", "limit", "fields"];
    exlcudeFields.forEach((item) => delete queryObj[item]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString)); //empty find means get all

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.replace(",", " ");
      this.query = this.query.sort(sortBy); //sort(' price, rating ') this means first by price and then by rating if items have same price
    } else this.query = this.query.sort("createdAt");

    return this;
  }

  fields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.replace(",", " ");
      this.query = this.query.select(fields); // selects only the specified data i.e " name duration "
    } else this.query = this.query.select("-__v"); // exclude __v

    return this;
  }

  paginator() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
