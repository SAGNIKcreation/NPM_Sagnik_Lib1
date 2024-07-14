#!/usr/bin/env node

import childProcess from "child_process";
import { Writable } from "stream";

class SagnikArka {
    private processExited = false;
    private nodeProcess!: childProcess.ChildProcessByStdio<Writable, null, null>;

    constructor() {
        if (process.argv.length !== 3) {
            console.error(
                `Expected 1 argument, received ${process.argv.length - 2} arguments`
            );
        } else {
            this.init();
        }
    }

    init = async () => {
        this.nodeProcess = await this.startProcess();
    }

    private startProcess = () => {
        const nodeProcess = childProcess.spawn("node", [process.argv[2]], { stdio: ["pipe", process.stdout, process.stderr] });
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

    private print = (type: keyof Console, message: string) => {
        (console[type] as (...data: any[]) => void)(`[SAGNIK_LIB_1_NODEMON]: ${message}`);
    };
}

export default new SagnikArka();
