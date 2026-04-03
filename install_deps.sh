#!/bin/bash
export PATH=/Users/fzehradinc/homebrew/bin:$PATH
echo "Installing Ruby..."
brew install ruby
export PATH=/Users/fzehradinc/homebrew/opt/ruby/bin:$PATH
echo "Ruby Version:"
ruby -v
echo "Installing Cocoapods..."
gem install cocoapods --no-document
export PATH=/Users/fzehradinc/homebrew/lib/ruby/gems/3.3.0/bin:$PATH
echo "Pod Version:"
pod --version
echo "DONE"
