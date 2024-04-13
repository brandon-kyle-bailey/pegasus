import { Injectable } from "../di/injectable.di";
import { EventBus } from "./event-bus.cqrs";

@Injectable()
export class CommandBus extends EventBus {}