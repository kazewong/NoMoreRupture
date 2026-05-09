# No more rupture

This is my vendetta project against achilles rupture, and by extension against all other accute lower extermity injuries in track and field. I am doing this purely out of spite against the injury, the Achilles injury god need to know it is messing with the wrong person.

> [!IMPORTANT]
> **The only goal of this project is minimize the chance of accute injury for the population and generations to come, not money, not fame, not anything else**. This will be the guiding principle of this project. If at any given point in time this principle is compromised, someone please fork this repo and carry the torch. 

# Can we predict when an Achilles injury is about to happen?

Tendons are like hairs, they don't have a lot of nerves. So if you pull on someone's hair, it is the tenson on the scalp that hurts, not the tension in the hair itself. If you isolate the scalp from the pulling, you will feel no pain in the hair itself until it breaks. Same story for tendons, except tendons are much more functionally important to athlete's life.

Tendon injury can happen under multiple conditions, for athletes, the main reasons that are relevant are:
1. Muscles gain too much strength while the tendons have not adapted adequately, resulting the muscles pulling the tendons apart. [A reference can be found here](https://pmc.ncbi.nlm.nih.gov/articles/PMC5717808/)
2. Chronic overuse creates degradation in the tendon, weakening it such that it cannot handle the load coming from the muscles.

Ideally we want to monitor the tendon health as much as possible, but as I mentioned above, our body do not have a lot of built-in mechanism to do so. Ultrasound imaging could be a way to monitor tendon health, however it is still not commonly accessible, and it is more used as a diagnostic tool (Used when the rupture has happened) instead of a monitoring tool (Used frequently while training under health condition). Creating ultrasound device that can help athletes monitor their tendon health is beyond the scope of this project, but I am working on it in parallel separately. I will make sure that is accessible when it is ready.

Another way we can potentially reduce the amount of Achilles injury in the world is to model our training statistically. **This is how this project will work**.
In the many medical studies, the answers to these questions are usually afterthoughts, i.e. people only look at common data such as age, height, activitiy level after someone get injury. This does not help predicting Achilles injury and therefore cannot help us augment our training when 
I want to do things different: **I need your help to build a database of people strength level as they train, and monitor the situation when injury happens.** Once we have enough data on athlete's strength level and potential time of injury, hopefully we will be able to identify patterns that can be used to predict an increase level of risk of injury.

# Methodology

Here is the battle plan:

1. We collect testing metrics from athletes around the world and record injury if there is any. This needs to be done over time. This is where you come in! You can contribute to the future which we can predict 
2. There will be huge variances among the dataset. Because this is a volunteer project, I do not want to force people to give all their information to me, even though that is by definition the best for the study. Because of this reason, there will be a lot of missing fields and wrong data. The idea is given enough data, we can sift through the noise and get to the signal. 
3. We will have a live statistics page on the website, as well as a detail analysis report on a fixed interval of time. We are going to start annually first assuming we have enough data.

## FAQ
1. Who is sponsoring this project?
    - Myself. I had enough with 


## Disclaimer

1. The data collected in this project is not for medical purposes.
2. Personal infromation that are usually targeted by data brokers are optional, for example name and geolocation. The reason of leaving them out 