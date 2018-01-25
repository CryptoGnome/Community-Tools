# Community-Tools

Make sure ruby is installed and available in your local PATH. You can check if it's already available by typing ruby -v in the command line.
Mac: Ruby is included by default
Windows: Use https://rubyinstaller.org and make sure to check Add Ruby executables to your PATH if prompted
*nix: Check https://www.ruby-lang.org/en/documentation/installation for instructions
Copy Gemfile and ProfitTrailerLogToSlack.rb to the same folder.
Open the command prompt and change directories to the folder containing the 2 files above.
Install the ruby dependencies
If you have bundler installed, you can simply type bundle install
If that doesn't work, type gem install file-tail and then gem install slack-notifier. Both of these commands may need sudo.
In a browser, go to https://my.slack.com/services/new/incoming-webhook and make sure you select the right workspace in the top right menu. Then click on "Incoming WebHooks" link in the breadcrumb menu.
Click "Add Configuration", choose which channel to post to, and click "Add Incoming WebHooks integration".
Copy the "Webhook URL" to the clipboard.
Run the script by passing in the location of the log file and the webhook URL from step 7: ruby ProfitTrailerLogToSlack.rb "/path/to/ProfitTrail/logs/ProfitTrailer.log" "https://hooks.slack.com/services/ABCDEF/G12345H/IJKMNOPQRTUV"
Example output:
