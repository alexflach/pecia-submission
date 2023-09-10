import { test, expect, vi } from "vitest";
import Clock from "./clock";

test("clock can be created with appropriate data types", () => {
    const clock = new Clock();

    const ts = clock.ts;
    const nn = clock.nn;
    const id = clock.id;

    expect(typeof ts).toBe("number");
    expect(typeof nn).toBe("number");
    expect(typeof id).toBe("string");
});

test("clock can be created with a persistent id", () => {
    const id = "myID";
    const clock = new Clock(id);
    expect(clock.id).toBe(id);
});

test("clock can be parsed from a valid clock string", () => {
    const id = "myID";
    const ts = 10000;
    const nn = 0;
    const clockString = `${ts}:${nn}:${id}`;

    const clock = Clock.parse(clockString);
    expect(clock.id).toBe(id);
    expect(clock.ts).toBe(ts);
    expect(clock.nn).toBe(nn);
});

test("an invalid clock string throws an error when parsed", () => {
    expect(() => Clock.parse("")).toThrow(Error);
    expect(() => Clock.parse("foo")).toThrow(Error);
    expect(() => Clock.parse("100:1:")).toThrow(Error);
    expect(() => Clock.parse("100:1:foo:extra")).toThrow(Error);
    expect(() => Clock.parse("foo:1:id")).toThrow(Error);
    expect(() => Clock.parse("100:foo:id")).toThrow(Error);
    expect(() => Clock.parse(":1:id")).toThrow(Error);
    expect(() => Clock.parse("::id")).toThrow(Error);
});

test("clock serializes correctly", () => {
    const id = "myID";
    const ts = 1000000;
    const nn = 10;

    const clock = new Clock(id, ts, nn);

    const clockString = clock.toString();

    expect(clockString).toBe(`${ts}:${nn}:${id}`);
});

// since the clock string comparison builds on the direct clock comparison
// these tests validate both.
test("clock strings are compared correctly by timestamp", () => {
    const cs1 = "10:0:id1";
    const cs2 = "5:3:id1";
    const cs3 = "30:1:id2";
    const cs4 = "31:1:id2";

    expect(Clock.maxFromStrings(cs1, cs2)).toBe(cs1);
    expect(Clock.maxFromStrings(cs2, cs1)).toBe(cs1);
    expect(Clock.maxFromStrings(cs2, cs3)).toBe(cs3);
    expect(Clock.maxFromStrings(cs4, cs3)).toBe(cs4);
});

test("clock strings are compared correctly by counter", () => {
    const cs1 = "10:0:id1";
    const cs2 = "10:3:id1";
    const cs3 = "10:1:id2";
    const cs4 = "10:2:id2";

    expect(Clock.maxFromStrings(cs1, cs2)).toBe(cs2);
    expect(Clock.maxFromStrings(cs2, cs1)).toBe(cs2);
    expect(Clock.maxFromStrings(cs2, cs3)).toBe(cs2);
    expect(Clock.maxFromStrings(cs4, cs3)).toBe(cs4);
    expect(Clock.maxFromStrings(cs4, cs2)).toBe(cs2);
});

test("clock strings are compared correctly by id", () => {
    const cs1 = "10:0:id1";
    const cs2 = "10:0:id2";
    const cs3 = "10:0:id3";
    const cs4 = "10:0:id4";

    expect(Clock.maxFromStrings(cs1, cs2)).toBe(cs2);
    expect(Clock.maxFromStrings(cs2, cs1)).toBe(cs2);
    expect(Clock.maxFromStrings(cs2, cs3)).toBe(cs3);
    expect(Clock.maxFromStrings(cs4, cs3)).toBe(cs4);
    expect(Clock.maxFromStrings(cs4, cs2)).toBe(cs4);
    expect(Clock.maxFromStrings(cs1, cs1)).toBe(cs1);
});

test("timestamp is updated as expected locally", async () => {
    //we need to mock the system clock to have reproducible tests
    vi.useFakeTimers();
    const systemTime = vi.getRealSystemTime();
    vi.setSystemTime(systemTime);

    const clock = new Clock();
    vi.setSystemTime(systemTime + 1);
    const t1 = clock.next();
    const t2 = clock.next(); //should have identical timestamp
    vi.setSystemTime(systemTime + 2);
    const t3 = clock.next();

    const c1 = Clock.parse(t1);
    const c2 = Clock.parse(t2);
    const c3 = Clock.parse(t3);

    expect(c1.nn).toBe(0);
    expect(c2.nn).toBe(1);
    expect(c3.nn).toBe(0);

    const id = c1.id;
    expect(c2.id).toBe(id);
    expect(c3.id).toBe(id);

    expect(c1.ts).toBe(c2.ts);

    vi.useRealTimers();
});

test("remote synching functions as expected", async () => {
    //note it is hard to test this adequately since it depends on system behaviour (receive behaviour depends on Date.now()
    // and it is impossible to guarantee when that will increment Fake timers are used to simulate
    vi.useFakeTimers();
    const systemTime = vi.getRealSystemTime();

    vi.setSystemTime(systemTime);

    const c1 = new Clock("c1");

    vi.setSystemTime(systemTime + 1);

    //now c2's timestamp will be greater than c1's original
    const c2 = new Clock("c2", null, 3);
    c1.receive(c2.toString()); // should have same timestamp as c2
    c2.receive(c1.toString()); // should still be same timestamp
    expect(c1.nn).toBe(4); //nn should be incremented
    expect(c2.nn).toBe(5); // ditto

    vi.setSystemTime(systemTime + 2);

    c2.next();
    c1.receive(c2.toString());
    expect(c2.nn).toBe(0); // should reset
    expect(c1.nn).toBe(1);

    vi.useRealTimers();
});
