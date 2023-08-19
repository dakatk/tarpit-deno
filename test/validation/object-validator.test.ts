import { 
    RequestBodyData, 
    QueryParamData, 
    RouteParamData
} from '../../lib/request/request-payload.ts';
import { Validator } from '../../lib/validation/validator.ts';
import { SchemaObject } from 'https://deno.land/x/value_schema@v3.1.0/dist-deno/libs/types.ts';
import { assertEquals, assertThrows } from "https://deno.land/std@0.198.0/assert/mod.ts";
import vs from 'https://deno.land/x/value_schema@v3.1.0/mod.ts';

Deno.test('`validate` returns same RequestBodyData on validation success', () => {
    // Arrange
    const schema: SchemaObject = {
        type: vs.string({
            only: ['json']
        }),
        value: vs.object({
            schemaObject: {
                test: vs.boolean(),
                testNumber: vs.number({
                    integer: true
                })
            }
        })
    };
    const validator = new Validator(schema);

    const expected: RequestBodyData = new RequestBodyData(
        'json',
        {
            test: true,
            testNumber: 1
        }
    );

    // Act
    const actual: RequestBodyData = validator.validate(expected) as RequestBodyData;

    // Assert
    assertEquals(actual.type, expected.type);
    assertEquals(actual.value, expected.value);
});

Deno.test('`validate` throws ValidationError on validation fail for RequestBodyData', () => {
    // Arrange
    const schema: SchemaObject = {
        type: vs.string({
            only: ['json']
        }),
        value: vs.object({
            schemaObject: {
                test: vs.boolean(),
                testNumber: vs.number({
                    integer: true
                })
            }
        })
    };
    const validator = new Validator(schema);

    const expected: RequestBodyData = new RequestBodyData(
        'json',
        {
            test: true
        }
    );

    // Act
    // Assert
    assertThrows(() => {
        validator.validate(expected)
    });
});

Deno.test('`validate` returns same QueryParamData on validation success', () => {
    // Arrange
    const schema: SchemaObject = {
        test: vs.boolean(),
        testNumber: vs.number({
            integer: true
        })
    };
    const validator = new Validator(schema);

    const expected: QueryParamData = {
        test: true,
        testNumber: 1
    };
    
    // Act
    const actual: QueryParamData = validator.validate(expected) as QueryParamData;

    // Assert
    assertEquals(actual, expected);
});

Deno.test('`validate` returns same RouteParamData on validation success', () => {
    // Arrange
    const schema: SchemaObject = {
        test: vs.boolean(),
        testNumber: vs.number({
            integer: true
        })
    };
    const validator = new Validator(schema);

    const expected: RouteParamData = {
        test: true,
        testNumber: 1
    };

    // Act
    const actual: RouteParamData = validator.validate(expected) as RouteParamData;

    // Assert
    assertEquals(actual, expected);
});
