#!/usr/bin/env node
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
const child_process_1 = __importDefault(require("child_process"));
class SagnikArka {
    constructor() {
        this.processExited = false;
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            this.nodeProcess = yield this.startProcess();
        });
        this.startProcess = () => {
            const nodeProcess = child_process_1.default.spawn("node", [process.argv[2]], { stdio: ["pipe", process.stdout, process.stderr] });
            this.processExited = false;
            process.stdin.pipe(nodeProcess.stdin);
            process.stdin.on("close", () => {
                process.stdin.unpipe(nodeProcess.stdin);
                process.stdin.resume();
            });
            nodeProcess.on("close", (code, signal) => {
                this.processExited = true;
                this.print("log", `Process ${process.argv[2]} exited with ${code ? `code ${code}` : `signal ${signal}`}`);
            });
            nodeProcess.on("error", (err) => {
                this.processExited = true;
                this.print("log", `Failed to start process ${process.argv[2]}`);
            });
            return nodeProcess;
        };
        this.print = (type, message) => {
            console[type](`[SAGNIK_LIB_1_NODEMON]: ${message}`);
        };
        if (process.argv.length != 3) {
            console.error(`Expected 1 argument, received ${process.argv.length - 2} arguments`);
        }
        else {
            this.init();
        }
    }
}
exports.default = new SagnikArka();
