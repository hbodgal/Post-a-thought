Issue 1

Till now  i developed Create Post, List Posts, Create Comment, List Comment.
But right now, we are making 1 server request for each post to get list on Comments.
This is very inefficient.
In, monolith architecture it is easy to solve.
We can just send a single response with posts with embedded comments in same json.
But, here we are using Microservices.

So one solution is Synchronous communication.
We can call Comments microservices from Posts microservice and get the comments for all the posts needed and send back single response to the user.

But it has some issues,
Introduces dependency between services
if any inter service fails, the overall request fails
The entire request is as fast as the slowest request
can easily introduce webs of requests


So other solution is :
Asynchronous communication 

We introduce an event broker
Whenever a post is created it will notify event broker
whenever a comment is craeated it will notify event broker
Here one more service will be introduced which will subscribe to those events (Query service)
And broker will notify Query service about new creation and
Query service will aggregate all the data (post + comments)
Now, client will request data from Query service to recieve 1 single response for comments and posts.

This approach solves 2 issues from above

Query service has no dependencies on other services
Query service will be very fast
But, it has data duplication and its hard to understand.



Some doubts :

Do we need to create new service everytime we need to join some data?
No! In reality, posts and comments might not be in seperate services



For now, we will implement our own event-bus using Express. And implement Async communication.

  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message);
  });

State 1 : We have CreatePost, CreateComment, List Post, List Comment by Post. All communicating via Event-bus and async communication.

New Post Creation: Post service -> event-bus -> query service
New Comment Creation: Comment service -> event bus -> query service
On Refresh, Client will get latest post and comment added.


State 2: Added moderation service
When user create comment on post, the comment will have 3types of state (pending, approved, rejected)
New comment created: comment service (commentCreated) -> event-bus  -> moderation (commentModerated) -> event-bus -> comment service (Comments object Updated) -> Query service (Response object updated - Ready to comsume)



This works like charm when we assume that no service is going to break down and all service will be available 100% of the time. But thats not the reality!


Sync request :  Query service request all the comment and posts using endpoints. But in production we wont ever request all the post and comments thats created till now. And we dont want to implement any synchronous request.

Direct DB Access: Query service can directly access post and comment DB. But, both might use different DB (SQl/NoSQL). And our purpose fails as we want 1 DB for each services. Not a good approach.

Store Events: Store the events in Event-bus Data store. And through endpoint access those data. And call the function that moderates all the events occured before.


issues still pending to solve:

what if post service goes down?
we need persistant database to store posts. But still we cannot retrive it; as post service is down.

what if comment service goes down?
We need persistant database to store comments. But still we cannot retrive it; as comments service is down and it cannot process service moderated event and call serviceUpdated event.

what if moderation service goes down. Will it be able to moderate events later and update status?
This issue was not covered in the tutorial. But i handled it on my own.
Solution:  We need to fetch all the events stored, filter out commentCreated event, moderate comment and create commentUpdated event.