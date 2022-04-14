import assert from 'assert';

export const acceptStrategy = {
    name: 'accept',

    storage() {
      let handlers = {};
      return {
        get: (type) => { return handlers[type] || null },
        set: (type, store) => { handlers[type] = store },
        del: (type) => { delete handlers[type] },
        empty: () => { handlers = {} }
      }
    },

    deriveConstraint(req, ctx) {
      return req.headers['accept'];
    },

    validate(value) {
        assert(typeof value === 'string')
    }
};

export const requestContentTypeStrategy = {
    name: 'contentType',

    storage() {
      let handlers = {};
      return {
        get: (type) => { return handlers[type] || null },
        set: (type, store) => { handlers[type] = store },
        del: (type) => { delete handlers[type] },
        empty: () => { handlers = {} }
      }
    },

    deriveConstraint(req, ctx) {
      return req.headers['content-type'];
    },

    validate(value) {
        assert(typeof value === 'string')
    }
};