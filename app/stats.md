---
layout: post
locale: en
script: stats.js
include_scripts: |
  <script src="/js/d3+geo.min.js"></script>
  <script src="/js/jenks.js"></script>
---

<section class="purple" markdown="1">

# Wrap Up

HelloVote was an experiment in civic engagement via mobile voter registration, and was built and launched on a rapid timeline.

Prior to the 2016 election, we built a team and a technology platform to let us communicate and engage with users on important issues at scale. We wrote a custom bot framework, form integrations with twelve state websites, a PDF generator, a personalized notification system, a "studio" to let people create their own compelling messages to register and vote, and a web-app to take [#ivoted selfies](https://twitter.com/hellovote_bot). We launched in mid-September in the week before National Voter Registration Day to great [press and social media](/press) coverage.

On Election Day we sent personalized and actionable reminder messages to Get Out The Vote, including calendar invitations, local weather forecasts, polling place reminders and directions, and an easy to use issue reporting tool that integrated with ProPublica's ElectionLand. We also answered hundreds of individual questions sent to team@hello.vote, and assisted users with finding legal advice when necessary via the Election Protection hotline 866-OUR-VOTE.

Thanks to our team, all our [organizational and celebrity partners](/partners), and users HelloVote was a great success. Fight for the Future will continue to experiment with new avenues for engaging everyone in the democratic process.

</section>

<section class="white">
    <h1>Stats</h1>
    <ul class="stats">
        <li><em>📲 4,510,850</em> <span>messages sent</span></li>
        <li><em>🙋 159,340</em> <span>users</span></li>
        <li><em>🗳 56,849</em> <span>new registrations submitted</span></li>
        <li><em>✅ 25,548</em> <span>registrations checked</span></li>
        <li><em>📆 11,140</em> <span>calendar reminders sent</span></li>
        <li><em>📬 9,326</em> <span>letters sent</span></li>
        <li><em>📸 2,315</em> <span>#ivoted selfies</span></li>
        <li><em>🎉 65%</em> <span>completion rate</span></li>
        <li><em>✊ 46</em> <span>partner organizations</span></li>
        <li><em>💃 27</em> <span>celebrities</span></li>
        <li><em>🤖🇺🇸 1</em> <span>awesome bot</span></li>
    </ul>
</section>

<section class="purple">
    <div class="content clear">
        <h2>Registrations</h2>

        <div class="d3 map" id="states">
          <h3>By State</h3>
        </div>

        <div class="d3 chart" id="ages">
          <h3>By Age</h3>
        </div>

        <div class="d3 chart" id="daily">
          <h3>By Day</h3>
        </div>

        <h2>Election Day</h2>

        <div class="d3 pie push-right" id="weather">
          <h3>Weather</h3>
        </div>

        <div class="d3 pie push-down" id="polling_places">
          <h3>Polling Places</h3>
        </div>
    </div>
</section>
