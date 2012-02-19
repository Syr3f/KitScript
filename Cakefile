fs = require 'fs'

{print} = require 'util'
{spawn} = require 'child_process'

build = (callback) ->
  
  coffee = spawn 'coffee', ['-c', '-o', 'scripts/my', 'src/scripts/my']
  
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  
  coffee.stdout.on 'data', (data) ->
    print data.toString() coffee.on 'exit', (code) ->

  callback?() if code is 0

watch = ->
  coffee = spawn 'coffee', ['-w', '-c', '-o', 'scripts/my', 'src/scripts/my']
  
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  
  coffee.stdout.on 'data', (data) ->
    print data.toString()

task 'build', 'Build scripts/my/ from src/scripts/my', -> build()

task 'watch', 'Watch src/scripts/my/ for changes', -> watch()
