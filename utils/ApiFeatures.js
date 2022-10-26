class ApiFeatures {

    constructor(mongooseQuery, queryString) {
        this.queryString = queryString;
        this.mongooseQuery = mongooseQuery;
    }

    filter() {
        const queryObject = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((field) => delete queryObject[field])
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery.sort(sortBy);
        }
        else {
            this.mongooseQuery.sort('-createAt');
        }
        return this;
    }

    select() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search() {
        if (this.queryString.keyword) {
            const regexQuery = {};
            regexQuery.$or = [{ title: { $regex: this.queryString.keyword, $options: 'i' } }, { description: { $regex: this.queryString.keyword, $options: 'i' } }];
            this.mongooseQuery.find(regexQuery);
        }
        return this;
    }

    paginate(documentsNumber) {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 50;
        const skip = (page - 1) * limit;
        const lastIndex = page * limit;
        const pagination = {};
        pagination.lastPage = Math.ceil(documentsNumber / limit);
        pagination.page = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(documentsNumber / limit);
        if (lastIndex < documentsNumber) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.previous = page - 1;
        }
        this.paginationResult = pagination;
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }


}
module.exports = ApiFeatures; 