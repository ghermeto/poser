FORMAT: 1A

# Parameters API
In this installment of the API Blueprint course we will discuss how to describe URI parameters.

But first let's add more messages to our system. For that we would need
introduce an message identifier – id. This id will be our parameter when
communicating with our API about messages.


# Group Messages
Group of all messages-related resources.

## My Message [/message/{id}]
Here we have added the message `id` parameter as an 
[URI Template variable](http://tools.ietf.org/html/rfc6570) in the Message
resource's URI. Note the parameter name `id` is enclosed in curly brackets. We
will discuss this parameter in the `Parameters` section below, where we will
also set its example value to `1` and declare it of an arbitrary 'number' type.

+ Parameters

    + id: 1 (number) - An unique identifier of the message.

### Retrieve a Message [GET]

+ Request Plain Text Message

    + Headers

            Accept: text/plain

+ Response 200 (text/plain)

    + Headers

            X-My-Message-Header: 42

    + Body

            Hello World!

+ Request JSON Message

    + Headers

            Accept: application/json

+ Response 200 (application/json)

    + Headers

            X-My-Message-Header: 42

    + Body

            {
              "id": 1,
              "message": "Hello World!"
            }

### Update a Message [PUT]

+ Request Update Plain Text Message (text/plain)

        All your base are belong to us.

+ Request Update JSON Message (application/json)

        { "message": "All your base are belong to us." }

+ Response 204

## All My Messages [/messages{?limit}]
A resource representing all of my messages in the system.

We have added the query URI template parameter - `limit`. This parameter is
used for limiting the number of results returned by some actions on this
resource. It does not affect every possible action of this resource, therefore
we will discuss it only at the particular action level below.

### Retrieve all Messages [GET]

+ Parameters

    + limit (number, optional) - The maximum number of results to return.
        + Default: `20`

+ Response 200 (application/json)

        [
          {
            "id": 1,
            "message": "Hello World!"
          },
          {
            "id": 2,
            "message": "Time is an illusion. Lunchtime doubly so."
          },
          {
            "id": 3,
            "message": "So long, and thanks for all the fish."
          }
        ]