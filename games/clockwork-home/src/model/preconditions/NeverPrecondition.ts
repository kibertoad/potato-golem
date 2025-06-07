import {Precondition} from "@potato-golem/core";

export class NeverPrecondition implements Precondition {
    isSatisfied(): boolean {
        return false;
    }
}