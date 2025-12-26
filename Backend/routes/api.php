<?php

use App\Http\Controllers\AdminAnalyticsController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ComparisonController;
use App\Http\Controllers\InteractionController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\PerfumeController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/user/init', [UserController::class, 'init']);

Route::post('/sessions/start', [SessionController::class, 'start']);
Route::post('/sessions/end', [SessionController::class, 'end']);

Route::post('/answers', [AnswerController::class, 'store']);

Route::post('/track', [InteractionController::class, 'track']);

Route::get('/perfumes', [PerfumeController::class, 'index']);
Route::get('/questions', [QuestionController::class, 'index']);

Route::post('/comparisons', [ComparisonController::class, 'store']);

Route::get('/recommendations/{uid}', [RecommendationController::class, 'get']);

Route::get('/admin/overview', [AdminAnalyticsController::class, 'overview']);
Route::get('/admin/questions', [AdminAnalyticsController::class, 'questions']);
Route::get('/admin/users', [AdminAnalyticsController::class, 'users']);
Route::get('/admin/comparisons', [AdminAnalyticsController::class, 'comparisons']);
