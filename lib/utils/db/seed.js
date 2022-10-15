"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const date_fns_1 = require("date-fns");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_1.default.testResult.deleteMany({});
        yield prisma_1.default.courseEnrollment.deleteMany({});
        yield prisma_1.default.test.deleteMany({});
        yield prisma_1.default.user.deleteMany({});
        yield prisma_1.default.course.deleteMany({});
        const weekFromNow = (0, date_fns_1.add)(new Date(), { days: 7 });
        const twoWeekFromNow = (0, date_fns_1.add)(new Date(), { days: 7 });
        const monthFromNow = (0, date_fns_1.add)(new Date(), { days: 7 });
        const justin = yield prisma_1.default.user.create({
            data: {
                email: "justin@email.com",
                firstName: "Justin",
                lastName: "Justin",
                social: {
                    facebook: "justinsolo",
                    twitter: "justinsolo",
                },
            },
        });
        const course = yield prisma_1.default.course.create({
            data: {
                name: "CRUD with Prisma",
                tests: {
                    create: [
                        {
                            date: weekFromNow,
                            name: "Test 1",
                        },
                        {
                            date: twoWeekFromNow,
                            name: "Test 2",
                        },
                        {
                            date: monthFromNow,
                            name: "Test 3",
                        },
                    ],
                },
                members: {
                    create: {
                        role: "TEACHER",
                        user: {
                            connect: {
                                email: "justin@email.com",
                            },
                        },
                    },
                },
            },
            include: {
                tests: true,
            },
        });
        const david = yield prisma_1.default.user.create({
            data: {
                email: "david@email.com",
                firstName: "David",
                lastName: "David",
                social: {
                    facebook: "david",
                    twitter: "david",
                },
                courses: {
                    create: {
                        role: "STUDENT",
                        course: {
                            connect: { id: course.id },
                        },
                    },
                },
            },
        });
        const ben = yield prisma_1.default.user.create({
            data: {
                email: "ben@email.com",
                firstName: "Ben",
                lastName: "Ben",
                social: {
                    facebook: "Ben",
                    twitter: "Benben",
                },
                courses: {
                    create: {
                        role: "STUDENT",
                        course: {
                            connect: { id: course.id },
                        },
                    },
                },
            },
        });
        const testResultsDavid = [650, 900, 950];
        const testResultsBen = [700, 800, 900];
        let counter = 0;
        for (const test of course.tests) {
            yield prisma_1.default.testResult.create({
                data: {
                    gradedBy: {
                        connect: { email: justin.email },
                    },
                    student: {
                        connect: { email: ben.email },
                    },
                    test: {
                        connect: { id: test.id },
                    },
                    result: testResultsBen[counter],
                },
            });
            yield prisma_1.default.testResult.create({
                data: {
                    gradedBy: {
                        connect: { email: justin.email },
                    },
                    student: {
                        connect: { email: david.email },
                    },
                    test: {
                        connect: { id: test.id },
                    },
                    result: testResultsDavid[counter],
                },
            });
            counter++;
        }
        // Get aggregate results for all tests
        for (const test of course.tests) {
            const result = yield prisma_1.default.testResult.aggregate({
                where: {
                    testId: test.id,
                },
                _avg: { result: true },
                _max: { result: true },
                _min: { result: true },
                _count: true,
            });
            console.log(`test: ${test.name} (id: ${test.id})`, result);
        }
        // Get aggregate results for all tests for a specific student
        // Ben
        const benAggregate = yield prisma_1.default.testResult.aggregate({
            where: {
                student: {
                    email: ben.email,
                },
            },
            _avg: { result: true },
            _max: { result: true },
            _min: { result: true },
            _count: true,
        });
        console.log(`Ben's result (email: ${ben.email})`, benAggregate);
        // David
        const davidAggregate = yield prisma_1.default.testResult.aggregate({
            where: {
                student: {
                    email: david.email,
                },
            },
            _avg: { result: true },
            _max: { result: true },
            _min: { result: true },
            _count: true,
        });
        console.log(`David's result (email: ${david.email})`, davidAggregate);
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma_1.default.$disconnect();
    process.exit(1);
}));
