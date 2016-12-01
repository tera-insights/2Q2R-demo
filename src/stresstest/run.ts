import User from "./User";

const numUsers = 1,
    appID = "_T-zi0wzr7GCi4vsfsXsUuKOfmiWLiHBVbmJJPidvhA",
    baseURL = "localhost:8080"

for (let i = 0; i < numUsers; i++) {
    new User(appID, "user-" + i, baseURL)
}
