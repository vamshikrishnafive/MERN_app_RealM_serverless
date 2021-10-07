let restaurants;
export default class ReastaurantsDAO {
    static async injectDB(connection) {
        if(restaurants){
            return
        } 
        try {
            restaurants = connection.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (error) {
            console.error(`Unable to establish a collection handle in restaurantDAO: ${error}`)
        }
    }
    static async getRestaurants({
        filters = null,
        page= 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if(filters) {
            if("name" in filters) {
                query = {$text: {$search: filters["name"]}}
            } else if ("cuisine" in filters) {
                query = {"cuisine": {$eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }
        let cursor;
        try {
            cursor = await restaurants.find(query)
        } catch (error) {
            console.error(`Uable to issues find command, ${error}`)
            return { restaurants: [], totalNumRestaurants: 0 }
        }
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)
        try {
            const reastaurantsList = await displayCursor.toArray();
            const totalNumRestaurants = await displayCursor.count(query)
            return { reastaurantsList, totalNumRestaurants };
        } catch (error) {
            console.error(`Uable to convert cursor to array or problem counting documents ${error}`)
            return { restaurants: [], totalNumRestaurants: 0 }
        }
    }
};