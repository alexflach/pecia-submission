import { test, expect, expectTypeOf } from "vitest";
import { LSEQ, Position } from "./lseq.ts";

test("start and end positions are generated correctly", () => {
    const replicaID = "a";

    const startPos = LSEQ.startPos(replicaID);
    const endPos = LSEQ.endPos(replicaID);

    expect(startPos).toBe("0:a");
    expect(endPos).toBe("100:a");
});

test("strings are parsed as expected", () => {
    const testString1 = "1:replica_ID";
    const testString2 = "13:122:1:replica_ID";

    const parsed1 = LSEQ.parse(testString1);
    const parsed2 = LSEQ.parse(testString2);

    expectTypeOf(parsed1).toEqualTypeOf<Position>();
    expectTypeOf(parsed2).toEqualTypeOf<Position>();

    expect(parsed1.replica).toBe("replica_ID");
    expect(parsed2.replica).toBe("replica_ID");

    expect(parsed1.depth).toBe(1);
    expect(parsed2.depth).toBe(3);

    expectTypeOf(parsed1.positions).toEqualTypeOf<number[]>();
    expectTypeOf(parsed2.positions).toEqualTypeOf<number[]>();

    expect(parsed1.positions).toEqual([1]);
    expect(parsed2.positions).toEqual([13, 122, 1]);
});

test("allocation between start and end positions works as expected", () => {
    const replicaID = "a";
    const startPos = LSEQ.startPos(replicaID);
    const endPos = LSEQ.endPos(replicaID);

    const newPos = LSEQ.alloc(startPos, endPos, replicaID);
    const newPosParsed = LSEQ.parse(newPos);

    expectTypeOf(newPos).toEqualTypeOf<string>();
    expectTypeOf(newPosParsed).toEqualTypeOf<Position>();
    expect(newPosParsed.depth).toBe(1);
    expect(newPosParsed.replica).toBe(replicaID);

    const newPosNumber = newPosParsed.positions[0];
    expect(newPosNumber).toBeGreaterThan(0);
    expect(newPosNumber).toBeLessThan(100);
});

test("allocation between nearby positions works as expected", () => {
    const replicaID = "a";
    const beforeNum = 10;
    const afterNum = 15;
    const beforePos = `${beforeNum}:${replicaID}`;
    const afterPos = `${afterNum}:${replicaID}`;

    const newPos = LSEQ.alloc(beforePos, afterPos, replicaID);
    const newPosParsed = LSEQ.parse(newPos);

    expectTypeOf(newPos).toEqualTypeOf<string>();
    expectTypeOf(newPosParsed).toEqualTypeOf<Position>();
    expect(newPosParsed.depth).toBe(1);
    expect(newPosParsed.replica).toBe(replicaID);

    const newPosNumber = newPosParsed.positions[0];
    expect(newPosNumber).toBeGreaterThan(beforeNum);
    expect(newPosNumber).toBeLessThan(afterNum);
});

test("allocation of between neighbouring positions works as expected", () => {
    const replicaID = "a";
    const beforeNum = 10;
    const afterNum = 11;
    const beforePos = `${beforeNum}:${replicaID}`;
    const afterPos = `${afterNum}:${replicaID}`;

    const newPos = LSEQ.alloc(beforePos, afterPos, replicaID);
    const newPosParsed = LSEQ.parse(newPos);

    expectTypeOf(newPos).toEqualTypeOf<string>();
    expectTypeOf(newPosParsed).toEqualTypeOf<Position>();
    expect(newPosParsed.depth).toBe(2);
    expect(newPosParsed.replica).toBe(replicaID);

    const topLevelNumber = newPosParsed.positions[0];
    expect(topLevelNumber).toBe(beforeNum);

    const newPosNumber = newPosParsed.positions[1];
    expect(newPosNumber).toBeGreaterThan(0);
    expect(newPosNumber).toBeLessThan(100);
});

test("positions from the same replica are compared as expected", () => {
    const testString1 = "10:a";
    const testString2 = "20:a";
    const testString3 = "10:20:a";
    const testString4 = "10:40:a";

    // simplest comparisons - single depth
    const compare1 = LSEQ.compare(testString1, testString2); // smaller first
    const compare2 = LSEQ.compare(testString2, testString1); // larger first
    const compare3 = LSEQ.compare(testString1, testString1); // same pos

    expect(compare1).toBe(-1);
    expect(compare2).toBe(1);
    expect(compare3).toBe(0);

    // compare at depth 2
    const compare4 = LSEQ.compare(testString3, testString4); // smaller first
    const compare5 = LSEQ.compare(testString4, testString3); // larger first
    const compare6 = LSEQ.compare(testString3, testString3); // same pos

    expect(compare4).toBe(-1);
    expect(compare5).toBe(1);
    expect(compare6).toBe(0);

    //compare across depths
    const compare7 = LSEQ.compare(testString1, testString3); // smaller first
    const compare8 = LSEQ.compare(testString4, testString1); // larger first
    const compare9 = LSEQ.compare(testString2, testString4); // larger first
    const compare10 = LSEQ.compare(testString4, testString2); //smaller first

    expect(compare7).toBe(-1);
    expect(compare8).toBe(1);
    expect(compare9).toBe(1);
    expect(compare10).toBe(-1);
});

test("positions from different replicas are compared as expected", () => {
    const testString1 = "10:a";
    const testString2 = "20:a";
    const testString3 = "10:b";
    //const testString4 = "20:b"; // not used this round
    const testString5 = "10:20:a";
    const testString6 = "10:40:a";
    const testString7 = "10:20:b";
    const testString8 = "10:40:b";

    // simplest comparisons - single depth
    const compare1 = LSEQ.compare(testString1, testString3); // smaller first
    const compare2 = LSEQ.compare(testString3, testString1); // larger first
    const compare3 = LSEQ.compare(testString3, testString2); // smaller first
    const compare4 = LSEQ.compare(testString2, testString3); // larger first

    expect(compare1).toBe(-1);
    expect(compare2).toBe(1);
    expect(compare3).toBe(-1);
    expect(compare4).toBe(1);

    // compare at depth 2
    const compare5 = LSEQ.compare(testString5, testString7); // smaller first
    const compare6 = LSEQ.compare(testString7, testString5); // larger first
    const compare7 = LSEQ.compare(testString6, testString7); // larger first
    const compare8 = LSEQ.compare(testString7, testString6); // smaller first

    expect(compare5).toBe(-1);
    expect(compare6).toBe(1);
    expect(compare7).toBe(1);
    expect(compare8).toBe(-1);

    //compare across depths
    const compare9 = LSEQ.compare(testString2, testString8); // larger first
    const compare10 = LSEQ.compare(testString8, testString2); // smaller first

    expect(compare9).toBe(1);
    expect(compare10).toBe(-1);
});

test("sorting strings works as expected", () => {
    const testString1 = "10:a";
    const testString2 = "20:a";
    const testString3 = "10:b";
    const testString4 = "20:b";
    const testString5 = "10:20:a";
    const testString6 = "10:40:a";
    const testString7 = "10:20:b";
    const testString8 = "10:40:b";

    const expectedOrder = [
        testString1,
        testString3,
        testString5,
        testString7,
        testString6,
        testString8,
        testString2,
        testString4,
    ];

    const stringArr = [
        testString1,
        testString2,
        testString3,
        testString4,
        testString5,
        testString6,
        testString7,
        testString8,
    ];
    const preSort = [...stringArr];

    const sorted = LSEQ.sort(stringArr);

    //check immutability
    expect(stringArr).toEqual(preSort);
    expect(sorted).not.toBe(stringArr);

    //check sort order
    expect(sorted).toEqual(expectedOrder);
});
