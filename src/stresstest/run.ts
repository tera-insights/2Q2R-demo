import * as config from 'config';
import User from "./User";

const numUsers = 1;

for (let i = 0; i < numUsers; i++) {
    new User(config.get("appID") as string, "user-" + i, config.get("2FAserver") as string)
}
