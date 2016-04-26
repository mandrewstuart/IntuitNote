# Apprentice Data Extractor

## Dependencies

 - Node 4^
 - MongoDB
 - Python 3
 - MySQL

## Installation

TODO: add python installation commands in makefile

    make

## Contributing

Look at the issue list on Bitbucket. Please choose an open issue before moving on.

If your contributions do no have a corresponding issue, create one for them and then carry on.

#### Creating Branches:

Most of the time your branch will stem from develop. Make sure you see the following before moving on:

    user$ git status
    On branch develop

Now you can create a new branch:

Format: `<issue#>/<description>`
Example:

    git checkout -b 10/account-settings

#### Commits

Format: `<component>: <description>`
Example:

    API: add group permissions

Create a pull request with your branch as soon as you want. Assign someone to review when it's ready.

#### Rebasing & Merging

Often the develop branch will be updated while you are working on something. This means you must get the latest code before you can merge.

Save what you're working on:

    git add -A
    git commit -m '.'

Switch to develop and get latest code:

    git checkout develop
    git pull

Switch back to your branch and rebase:

    git checkout 10/account-settings
    git rebase -i develop

Use interactive mode to squash or rename commits.
Fix any conflicts that come up.

Once you're done this you can merge back into develop:

    git checkout develop
    git merge 10/account-settings
    git push origin develop