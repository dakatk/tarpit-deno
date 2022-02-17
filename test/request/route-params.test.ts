import { 
    RouteSegment, 
    isParameterizedRoute, 
    compileParametrizedRoute, 
    checkParameterizedRoute 
} from '../../lib/request/route-params.ts';
import { assert, assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";

Deno.test('isParameterizedRoute returns true', () => {
    const route = '/hello/{id}/world';
    assert(isParameterizedRoute(route));
});

Deno.test('isParameterizedRoute returns false', () => {
    const route = '/hello/world';
    assert(!isParameterizedRoute(route));
});

Deno.test('compileParameterizedRoute', () => {
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
    assertEquals(compileParametrizedRoute(route), expected);
});

Deno.test('checkParameterizedRoute returns object with keys', () => {
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
    const expected: any = {
        id: '1',
        name: 'me'
    };

    assertEquals(checkParameterizedRoute(route, compiled), expected);
});

Deno.test('checkParameterizedRoute returns undefined', () => {
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

    assertEquals(checkParameterizedRoute(route, compiled), undefined);
});
