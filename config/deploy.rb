set :user, "ec2-user"
set :application, "arsock"
set :repository, "git@github.com:uniba/arsock.git"
set :scm, :git
set :branch, "master"
set :scm_verbose, true
set :deploy_to, "/home/#{user}/app/#{application}"
set :deploy_via, :copy
set :git_shallow_clone, 1

role :web, "realtimeweblog.in"
role :app, "realtimeweblog.in"

namespace :deploy do
  task :start do
    run "forever start #{current_path}/app.js"
  end
  task :stop do
    run "forever stop #{current_path}/app.js"
  end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "forever restart #{current_path}/app.js"
  end
end

after "deploy:symlink", :roles => :app do
  run "ln -svf #{shared_path}/node_modules #{current_path}/node_modules"
  run "cd #{current_path} && npm install"
end