import { 
    RouteSegment, 
    isParameterizedRoute, 
    compileParametrizedRoute, 
    checkParameterizedRoute 
} from '../../lib/request/route-params.ts';
import { assert, assertEquals } from 'https://deno.land/std@0.126.0/testing/asserts.ts';
import { RouteParamData } from "../../lib/request/request-payload.ts";

Deno.test('`isParameterizedRoute` returns true for parameterized URI', () => {
    // Arrange
    const route = '/hello/{id}/world';

    // Act
    const result = isParameterizedRoute(route);

    // Assert
    assert(result);
});

Deno.test('`isParameterizedRoute` returns false for simple URI', () => {
    // Arrange
    const route = '/hello/world';

    // Act
    const result = isParameterizedRoute(route);

    // Assert
    assert(!result);
});

Deno.test('`compileParameterizedRoute` returns route segments with params', () => {
    // Arrange
    const route = '/user/{id}/{name}';
    const expected: RouteSegment[] = [
        {
            value: 'user',
            param: undefined
        },
        {
            value: '{id}',
            param: 'id'
        },
        {
            value: '{name}',
            param: 'name'
        }
    ];

    // Act
    const result = compileParametrizedRoute(route);

    // Assert
    assertEquals(result, expected);
});

Deno.test('`checkParameterizedRoute` returns object with keys', () => {
    // Arrange
    const route = '/user/1/me';
    const compiled: RouteSegment[] = [
        {
            value: 'user',
            param: undefined
        },
        {
            value: '{id}',
            param: 'id'
        },
        {
            value: '{name}',
            param: 'name'
        }
    ];

    const expected = new RouteParamData()
    expected.id = '1';
    expected.name = 'me';

    // Act
    const result = checkParameterizedRoute(route, compiled);

    // Assert
    assertEquals(result, expected);
});

Deno.test('`checkParameterizedRoute` returns undefined when URI fails match', () => {
    // Arrange
    const route = '/use/1/me';
    const compiled: RouteSegment[] = [
        {
            value: 'user',
            param: undefined
        },
        {
            value: '{id}',
            param: 'id'
        },
        {
            value: '{name}',
            param: 'name'
        }
    ];

    // Act
    const result = checkParameterizedRoute(route, compiled);

    // Assert
    assertEquals(result, undefined);
});
