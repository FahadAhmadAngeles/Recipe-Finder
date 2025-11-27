User
    As customer (saves recipes)
    Has saved lists

Recipe => SavedList
    Each saved list can have multiple recipes

SavedList => User
    Each user can have one saved list
    Tracks which recipes a user has saved

User => Recipe
    Users can view and save recipes
    Users can create new recipes

Recipe Rating
    Users can rate recipes (0-5 stars)
    Each recipe has one overall rating