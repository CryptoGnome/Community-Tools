###############
# USER CONFIG #
###############

SHOW_HEARTBEATS = false
SHOW_EMOJI = true
SHOW_STRATEGY_RUNNER = false

###############
# DO NOT EDIT # (unless you know what you're doing)
###############

require "file/tail"
require "json"
require "slack-notifier"

log_file = ARGV[0]
slack_url = ARGV[1]

notifier = Slack::Notifier.new(slack_url)

File.open(log_file) do |log|
  log.extend(File::Tail)
  log.interval
  log.backward(0)
  log.tail do |line| 
    parts = line.split(" ")

    log_type = parts[2]
    service = parts[3]

    if log_type == "INFO"
      raw_message = parts[5..-1].join(" ")
      
      if raw_message == "DCA Heartbeat"
         message = "DCA :heart:" if SHOW_HEARTBEATS
      elsif raw_message == "Cache Heartbeat"
         message = "Cache :heart:" if SHOW_HEARTBEATS
      elsif raw_message == "Normal Heartbeat"
         message = "Normal :heart:" if SHOW_HEARTBEATS
      elsif raw_message.include?("Get order information -- ")
        # {
        #   'symbol': 'ICXBTC',
        #   'price': 0.00071070,
        #   'status': 'EXPIRED',
        #   'type': 'LIMIT',
        #   'side': 'BUY',
        # }

        raw_json = raw_message.split("Get order information -- ").last
        parsed_json = JSON.parse(raw_json)

        symbol = parsed_json["symbol"]
        price = parsed_json["price"]
        status = parsed_json["status"]
        type = parsed_json["type"]
        side = parsed_json["side"]
        emoji = ""

        if status == "FILLED"
          status = "been _FILLED_"

          if SHOW_EMOJI
            if side == "BUY"
              emoji = ":chart_with_downwards_trend: "
            else
              emoji = ":chart_with_upwards_trend: "
            end
          end

          message = "#{emoji}The _#{type} #{side}_ order for *#{price}* of *#{symbol}* has #{status}"
        else
          emoji = ":warning: " if SHOW_EMOJI

          message = "#{emoji}The _#{type} #{side}_ order for #{price} of #{symbol} has _#{status}_"
        end

        
      elsif raw_message.include?("Buy order for ") || raw_message.include?("Sell order for ")
        # Buy order for VENBTC --
        # {
        #   'symbol': 'VENBTC',
        #   'price': '0.00071795',
        #   'status': 'FILLED',
        #   'type': 'LIMIT',
        #   'side': 'BUY'
        # }
        # Sell order for VENBTC sold amount 3.000000 for price 0.000725 --
        # {
        #   'symbol': 'VENBTC',
        #   'price': '0.00072519',
        #   'type': 'LIMIT',
        #   'side': 'SELL'
        # }

        raw_json = raw_message.split(" ").last
        parsed_json = JSON.parse(raw_json)

        symbol = parsed_json["symbol"]
        price = parsed_json["price"]
        type = parsed_json["type"]
        side = parsed_json["side"]
        emoji = SHOW_EMOJI ? ":zap: " : ""

        message = "#{emoji}Placing _#{type} #{side}_ order for #{price} of #{symbol}"
      elsif raw_message == "Detected configuration changes"
        emoji = SHOW_EMOJI ? ":memo: " : ""
        message = "#{emoji}#{raw_message}"
      elsif service == "DCAStrategyRunner"
        emoji = SHOW_EMOJI ? ":chart_with_downwards_trend: " : ""
        message = "#{emoji}#{raw_message}" if SHOW_STRATEGY_RUNNER
      elsif service == "NormalStrategyRunner"
        emoji = SHOW_EMOJI ? ":recycle: " : ""
        message = "#{emoji}#{raw_message}" if SHOW_STRATEGY_RUNNER
      else
        emoji = SHOW_EMOJI ? ":information_source: " : ""
        message = "#{emoji}#{raw_message}"
      end
    elsif log_type == "ERROR"
      raw_message = parts[5..-1].join(" ")
      
      emoji = SHOW_EMOJI ? ":x: " : ""
      message = "#{emoji}#{raw_message}"
    else
      message = line # splat entire line
    end

    notifier.ping(message) if message
  end
end