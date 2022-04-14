FORMAT: 1A

# Advanced Action API
A resource action is – in fact – a state transition. This API example
demonstrates an action - state transition - to another resource.


# Tasks [/tasks/tasks{?status,priority}]

+ Parameters
    + status (string)
    + priority (number)

## List All Tasks [GET]

+ Response 200 (application/json)

        [
            {
                "id": 123,
                "name": "Exercise in gym",
                "done": false,
                "type": "task"
            },
            {
                "id": 124,
                "name": "Shop for groceries",
                "done": true,
                "type": "task"
            }
        ]

## Retrieve Task [GET /task/{id}]
This is a state transition to another resource.

+ Parameters
    + id (string)

+ Response 200 (application/json)

        {
            "id": 123,
            "name": "Go to gym",
            "done": false,
            "type": "task"
        }

## Delete Task [DELETE /task/{id}]

+ Parameters
    + id (string)

+ Response 204