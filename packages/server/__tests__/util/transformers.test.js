import { routeTransformer, bodyTransformer } from '../../lib/util/transformers.js';
import { assert } from 'chai';

describe('util/transformers', () => {
    describe('routeTransformer', () => {
        it('should replace curly brakets with colon', () => {
            const descriptorPath = '/app/vhalla/{id}';
            const apiPath = routeTransformer(descriptorPath);
            assert.equal(apiPath, '/app/vhalla/:id');
        });
    
        it('should interpolate expansions', () => {
            const descriptorPath = '/app/vhalla/{+path}';
            const apiPath = routeTransformer(descriptorPath);
            assert.equal(apiPath, '/app/vhalla/:path+');
        });
    
        it('should remove querystrings', () => {
            const descriptorPath = '/app/vhalla{?status}';
            const apiPath = routeTransformer(descriptorPath);
            assert.equal(apiPath, '/app/vhalla');
        });
    
        it('should remove querystrings for /tasks/tasks{?status,priority}', () => {
            const descriptorPath = '/tasks/tasks{?status,priority}';
            const apiPath = routeTransformer(descriptorPath);
            assert.equal(apiPath, '/tasks/tasks');
        });
    
        it('should remove fragments', () => {
            const descriptorPath = '/app/vhalla{#fragment}';
            const apiPath = routeTransformer(descriptorPath);
            assert.equal(apiPath, '/app/vhalla');
        }); 
        
        it('should replace when template has precending space', () => {
            const descriptorPath = '/app/vhalla/{ id}';
            const apiPath = routeTransformer(descriptorPath);
            assert.equal(apiPath, '/app/vhalla/:id');
        });

        it('should replace when template has following space', () => {
            const descriptorPath = '/app/vhalla/{id }';
            const apiPath = routeTransformer(descriptorPath);
            assert.equal(apiPath, '/app/vhalla/:id');
        });

        it('should replace when template has surounding space', () => {
            const descriptorPath = '/app/vhalla/{ id }';
            const apiPath = routeTransformer(descriptorPath);
            assert.equal(apiPath, '/app/vhalla/:id');
        });
    });

    describe('bodyTransformer', () => {
        it('should transform a body with content-type text/plain', () => {
            const template = 'This is a {{params.test}} message!';
            const transformed = bodyTransformer(template, { params: { test: 'fake' }});
            assert.equal(transformed, 'This is a fake message!');
        });

        it('should transform a body using faker', () => {
            const template = 'My fake company name is {{faker.company.companyName}}';
            const transformed = bodyTransformer(template, {});
            assert.notEqual(transformed, template);
            assert.match(transformed, /My fake company name is [a-zA-Z][\'\w]+/);
        });

        it('should transform a body with content-type application/json', () => {
            const template = '{"id": {{params.id}}, "name": "{{params.name}}", "status": "ok", "enabled": true}';
            const transformed = bodyTransformer(template, { params: { id: 1, name: 'test' }});
            const json = JSON.parse(transformed);
            assert.equal(json.id, 1);
            assert.equal(json.name, 'test');
            assert.equal(json.status, 'ok');
            assert.equal(json.enabled, true);
        });
    });
});
