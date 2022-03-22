import { ActivityHandler, CardFactory, MessageFactory } from "botbuilder";
import * as ACData from "adaptivecards-templating";
import * as WeatherCard from "../cards/WeatherCard.json";
import * as WelcomeCard from "../cards/WelcomeCard.json";
import { Weather } from "./Weather";


export class WeatherBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            // Extract location name
            const locationName = context.activity.text.trim();
            // Get current weather for location
            const weather = new Weather();
            const weatherData = await weather.getWeather(locationName);
            // Create card response
            const template = new ACData.Template(WeatherCard);
            const cardPayload = template.expand({ $root: weatherData });
            const card = CardFactory.adaptiveCard(cardPayload);

            await context.sendActivity(MessageFactory.attachment(card));
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const card = CardFactory.adaptiveCard(WelcomeCard);
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.attachment(card));
                }
            }
            await next();
        });
    }
}