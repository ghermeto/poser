import { validateRoute } from '../../lib/util/validators.js';
import { assert } from 'chai';

describe('util/validators', () => {
    describe('validateRoute', () => {
        it('should sucessfully validate a route with a param', () => {
            const path = '/app/vhalla/:id';
            assert.doesNotThrow(() => {
                validateRoute(path);
            }, '/app/vhalla/:id is a valid route');
        });
    
        it('should sucessfully validate /message/:id', () => {
            const path = '/message/:id';
            assert.doesNotThrow(() => {
                validateRoute(path);
            }, '/message/:id is a valid route');
        });
    
        it('should sucessfully validate root', () => {
            const path = '/';
            assert.doesNotThrow(() => {
                validateRoute(path);
            }, '/ is a valid route');
        });
    
        it('should sucessfully validate a route with two params', () => {
            const path = '/app/:location/:id';
            assert.doesNotThrow(() => {
                validateRoute(path);
            }, '/app/:location/:id is a valid route');
        });
    
        it('should sucessfully validate a route with a extended param', () => {
            const path = '/app/:location+';
            assert.doesNotThrow(() => {
                validateRoute(path);
            }, '/app/:location+ is a valid route');
        });
    
        it('should sucessfully validate a route without a param', () => {
            const path = '/app/vhalla/1';
            assert.doesNotThrow(() => {
                validateRoute(path);
            }, '/app/vhalla/1 is a valid route');
        });

        it('should fail validation on a rute with ?', () => {
            const path = '/app/vhalla/?id';
            assert.throws(() => {
                validateRoute(path);
            }, 'Route \'/app/vhalla/?id\' is not valid!');
        });

        it('should fail validation on a rute with #', () => {
            const path = '/app/vhalla/#status';
            assert.throws(() => {
                validateRoute(path);
            }, 'Route \'/app/vhalla/#status\' is not valid!');
        });

        it('should fail validation on a rute with &', () => {
            const path = '/app/vhalla/&test';
            assert.throws(() => {
                validateRoute(path);
            }, 'Route \'/app/vhalla/&test\' is not valid!');
        });
    });
});
